import { Xendit } from 'xendit-node'
import xenditConfig from '#config/xendit'
import Order from '#models/order'
import Payment from '#models/payment'
import Variant from '#models/variant'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

export interface CreatePaymentInput {
  orderId: number
  paymentMethod: 'QRIS' | 'VIRTUAL_ACCOUNT' | 'EWALLET'
  paymentChannel?: string
}

export interface WebhookPayload {
  event: string
  data: {
    id: string
    reference_id: string
    status: string
    amount: number
    payment_method?: any
    metadata?: any
  }
}

export class PaymentService {
  readonly #client: InstanceType<typeof Xendit>['PaymentRequest']

  constructor() {
    const xendit = new Xendit({ secretKey: xenditConfig.secretKey })
    this.#client = xendit.PaymentRequest
  }

  async createPayment(input: CreatePaymentInput) {
    const { orderId, paymentMethod, paymentChannel } = input

    const order = await Order.find(orderId)
    if (!order) {
      throw new Error('Order not found')
    }

    if (order.status !== 'PENDING') {
      throw new Error('Order is not in PENDING status')
    }

    const referenceId = `PAY-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    const paymentMethodType = this.#mapPaymentMethodType(paymentMethod)
    const amount = Number(order.amount)

    // Build PaymentRequestParameters according to xendit-node v7 docs
    const data: any = {
      referenceId,
      amount,
      currency: 'IDR',
      country: 'ID',
      paymentMethod: {
        type: paymentMethodType,
        reusability: 'ONE_TIME_USE',
      },
      metadata: { orderId: order.id },
    }

    if (paymentMethod === 'QRIS') {
      data.paymentMethod.qrCode = {
        channelCode: 'QRIS',
      }
    } else if (paymentMethod === 'VIRTUAL_ACCOUNT') {
      if (!paymentChannel) {
        throw new Error('paymentChannel is required for VIRTUAL_ACCOUNT')
      }

      // customerName: letters and spaces only, max 20 chars for some banks
      const rawName = order.email.split('@')[0] || 'Customer'
      const customerName = rawName
        .replace(/[^a-zA-Z]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 20) || 'Customer'

      // expiresAt: ISO 8601 UTC format
      const expiresAt = DateTime.now().plus({ hours: 24 }).toUTC().toISO()

      data.paymentMethod.referenceId = referenceId
      data.paymentMethod.virtualAccount = {
        channelCode: paymentChannel,
        channelProperties: {
          customerName,
          expiresAt,
        },
      }
    } else if (paymentMethod === 'EWALLET') {
      if (!paymentChannel) {
        throw new Error('paymentChannel is required for EWALLET')
      }
      data.paymentMethod.ewallet = {
        channelCode: paymentChannel,
        channelProperties: {
          successReturnUrl: xenditConfig.successRedirectUrl,
          failureReturnUrl: xenditConfig.failureRedirectUrl,
        },
      }
    }

    let xenditResponse: any
    try {
      xenditResponse = await this.#client.createPaymentRequest({ data })
    } catch (xenditError: any) {
      // Extract detailed error from Xendit SDK
      const rawBody = xenditError?.rawResponse?.body
      const errorDetail = rawBody
        ? (typeof rawBody === 'string' ? rawBody : JSON.stringify(rawBody))
        : xenditError?.message || 'Unknown Xendit API error'
      console.error('[Xendit createPaymentRequest Error]', {
        status: xenditError?.status || xenditError?.statusCode,
        errorCode: rawBody?.errorCode || rawBody?.error_code,
        message: rawBody?.message,
        requestData: JSON.stringify(data, null, 2),
      })
      throw new Error(`Xendit API error: ${errorDetail}`)
    }

    // Extract payment details from response
    const { qrString, qrUrl, vaNumber, ewalletUrl } = this.#extractPaymentDetails(
      paymentMethod,
      xenditResponse
    )

    // Extract expiry date
    const expiryDate = this.#extractExpiryDate(paymentMethod, xenditResponse)

    // Save payment record
    const payment = await Payment.create({
      orderId: order.id,
      paymentProvider: 'xendit',
      paymentMethod,
      paymentChannel: paymentChannel || null,
      externalPaymentId: xenditResponse.id || null,
      externalReferenceId: referenceId,
      amount,
      status: 'PENDING',
      qrString,
      qrUrl,
      vaNumber,
      ewalletUrl,
      expiryDate,
      rawResponse: xenditResponse as unknown as Record<string, any>,
    })

    return {
      id: payment.id,
      orderId: payment.orderId,
      paymentMethod: payment.paymentMethod,
      paymentChannel: payment.paymentChannel,
      externalPaymentId: payment.externalPaymentId,
      externalReferenceId: payment.externalReferenceId,
      amount: payment.amount,
      status: payment.status,
      qrString: payment.qrString,
      qrUrl: payment.qrUrl,
      vaNumber: payment.vaNumber,
      ewalletUrl: payment.ewalletUrl,
      expiryDate: payment.expiryDate,
    }
  }

  async getPaymentStatus(paymentId: number) {
    const payment = await Payment.find(paymentId)
    if (!payment) {
      throw new Error('Payment not found')
    }

    return {
      id: payment.id,
      orderId: payment.orderId,
      paymentMethod: payment.paymentMethod,
      paymentChannel: payment.paymentChannel,
      status: payment.status,
      amount: payment.amount,
      qrString: payment.qrString,
      qrUrl: payment.qrUrl,
      vaNumber: payment.vaNumber,
      ewalletUrl: payment.ewalletUrl,
      expiryDate: payment.expiryDate,
      paidAt: payment.paidAt,
    }
  }

  async handleWebhook(payload: WebhookPayload) {
    const { data } = payload

    // Find payment by external_reference_id or external_payment_id
    let payment = await Payment.query().where('external_reference_id', data.reference_id).first()

    if (!payment) {
      payment = await Payment.query().where('external_payment_id', data.id).first()
    }

    if (!payment) {
      throw new Error('Payment not found')
    }

    // Idempotency: if payment is already in a terminal state, return early
    if (payment.status === 'PAID') {
      return payment
    }

    // Map Xendit status to our status
    const mappedStatus = this.#mapXenditStatus(data.status)

    // Wrap in transaction for atomicity
    const trx = await db.transaction()

    try {
      payment.useTransaction(trx)
      payment.status = mappedStatus
      payment.webhookPayload = payload as unknown as Record<string, any>

      if (mappedStatus === 'PAID') {
        payment.paidAt = DateTime.now()
      }

      await payment.save()

      if (mappedStatus === 'PAID') {
        // Update order status and reduce stock
        const order = await Order.query({ client: trx })
          .where('id', payment.orderId)
          .preload('items')
          .firstOrFail()

        // Validate amount matches
        if (Math.round(data.amount) !== Math.round(Number(order.amount))) {
          throw new Error(
            `Amount mismatch: webhook amount ${data.amount} does not match order amount ${order.amount}`
          )
        }

        order.status = 'PROCESSING'
        order.paidAt = DateTime.now()
        await order.save()

        // Reduce stock for each order item
        for (const item of order.items) {
          const variantToDecrement = await Variant.query({ client: trx })
            .where('product_id', item.productId)
            .whereRaw('stock >= ?', [item.quantity])
            .first()

          if (!variantToDecrement) {
            throw new Error(
              `Insufficient stock for product ${item.productId} (requested: ${item.quantity})`
            )
          }

          await Variant.query({ client: trx })
            .where('id', variantToDecrement.id)
            .decrement('stock', item.quantity)
        }
      } else if (mappedStatus === 'FAILED' || mappedStatus === 'EXPIRED') {
        const order = await Order.query({ client: trx }).where('id', payment.orderId).firstOrFail()

        order.status = mappedStatus === 'FAILED' ? 'FAILED' : 'EXPIRED'
        await order.save()
      }

      await trx.commit()
      return payment
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  // ──── Private helpers ────────────────────────────────────────────────────────

  #extractPaymentDetails(paymentMethod: string, xenditResponse: any) {
    let qrString: string | null = null
    let qrUrl: string | null = null
    let vaNumber: string | null = null
    let ewalletUrl: string | null = null

    if (paymentMethod === 'QRIS') {
      // QR string from paymentMethod.qrCode.channelProperties
      const qrCode = xenditResponse.paymentMethod?.qrCode
      if (qrCode?.channelProperties?.qrString) {
        qrString = qrCode.channelProperties.qrString
      }
      // Fallback: check actions array
      if (!qrString && xenditResponse.actions?.length) {
        for (const action of xenditResponse.actions) {
          if (action.action === 'PRESENT_TO_CUSTOMER' || action.urlType === 'QR_STRING') {
            qrString = action.qrCode || action.qrString || null
            qrUrl = action.url || null
            break
          }
        }
      }
    } else if (paymentMethod === 'VIRTUAL_ACCOUNT') {
      // VA number from paymentMethod.virtualAccount.channelProperties
      const va = xenditResponse.paymentMethod?.virtualAccount
      if (va?.channelProperties?.virtualAccountNumber) {
        vaNumber = va.channelProperties.virtualAccountNumber
      }
    } else if (paymentMethod === 'EWALLET') {
      // E-wallet URL from actions array
      if (xenditResponse.actions?.length) {
        // Prefer MOBILE/DEEPLINK, then WEB, then any
        const action =
          xenditResponse.actions.find((a: any) => a.urlType === 'MOBILE' || a.urlType === 'DEEPLINK') ||
          xenditResponse.actions.find((a: any) => a.urlType === 'WEB') ||
          xenditResponse.actions[0]
        if (action?.url) {
          ewalletUrl = action.url
        }
      }
    }

    return { qrString, qrUrl, vaNumber, ewalletUrl }
  }

  #extractExpiryDate(paymentMethod: string, xenditResponse: any): DateTime | null {
    // Try actions[].expiresAt
    if (xenditResponse.actions?.length) {
      const expiry = xenditResponse.actions[0]?.expiresAt || xenditResponse.actions[0]?.expires_at
      if (expiry) {
        return DateTime.fromISO(expiry)
      }
    }

    // For VA, check channelProperties.expiresAt
    if (paymentMethod === 'VIRTUAL_ACCOUNT') {
      const va = xenditResponse.paymentMethod?.virtualAccount
      const vaExpiry = va?.channelProperties?.expiresAt || va?.channelProperties?.expires_at
      if (vaExpiry) {
        return DateTime.fromISO(vaExpiry)
      }
    }

    // Default: 24 hours from now
    return DateTime.now().plus({ hours: 24 })
  }

  #mapPaymentMethodType(method: string): string {
    switch (method) {
      case 'QRIS':
        return 'QR_CODE'
      case 'VIRTUAL_ACCOUNT':
        return 'VIRTUAL_ACCOUNT'
      case 'EWALLET':
        return 'EWALLET'
      default:
        return method
    }
  }

  #mapXenditStatus(status: string): 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED' | 'CANCELLED' {
    switch (status) {
      case 'SUCCEEDED':
      case 'CAPTURED':
        return 'PAID'
      case 'FAILED':
        return 'FAILED'
      case 'EXPIRED':
        return 'EXPIRED'
      case 'CANCELLED':
        return 'CANCELLED'
      default:
        return 'PENDING'
    }
  }
}
