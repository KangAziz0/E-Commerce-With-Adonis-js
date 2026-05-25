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

    const requestData: any = {
      referenceId,
      amount: Number(order.amount),
      currency: 'IDR',
      paymentMethod: {
        type: paymentMethodType,
        reusability: 'ONE_TIME_USE',
      },
      metadata: { orderId: order.id },
    }

    if (paymentMethod === 'QRIS') {
      requestData.paymentMethod.qrCode = {
        channelCode: 'QRIS',
      }
    } else if (paymentMethod === 'VIRTUAL_ACCOUNT') {
      if (!paymentChannel) {
        throw new Error('paymentChannel is required for VIRTUAL_ACCOUNT')
      }
      requestData.paymentMethod.virtualAccount = {
        channelCode: paymentChannel,
        channelProperties: {
          customerName: order.email,
        },
      }
    } else if (paymentMethod === 'EWALLET') {
      if (!paymentChannel) {
        throw new Error('paymentChannel is required for EWALLET')
      }
      requestData.paymentMethod.ewallet = {
        channelCode: paymentChannel,
        channelProperties: {
          successReturnUrl: xenditConfig.successRedirectUrl,
        },
      }
    }

    const xenditResponse = await this.#client.createPaymentRequest({ data: requestData })

    // Extract payment details from response
    let qrString: string | null = null
    let qrUrl: string | null = null
    let vaNumber: string | null = null
    let ewalletUrl: string | null = null

    if (paymentMethod === 'QRIS') {
      // QR string is in actions array
      const presentAction = xenditResponse.actions?.find(
        (a: any) => a.action === 'PRESENT_TO_CUSTOMER'
      )
      if (presentAction) {
        qrString = presentAction.qrCode || null
        qrUrl = presentAction.url || null
      }
    } else if (paymentMethod === 'VIRTUAL_ACCOUNT') {
      // VA number is in paymentMethod.virtualAccount.channelProperties
      const va = xenditResponse.paymentMethod?.virtualAccount
      if (va?.channelProperties) {
        vaNumber = (va.channelProperties as any).virtualAccountNumber || null
      }
    } else if (paymentMethod === 'EWALLET') {
      // E-wallet URL is in actions array
      const action = xenditResponse.actions?.find(
        (a: any) => a.urlType === 'MOBILE' || a.urlType === 'WEB' || a.urlType === 'DEEPLINK'
      )
      if (action) {
        ewalletUrl = action.url || null
      }
    }

    // Save payment record
    const payment = await Payment.create({
      orderId: order.id,
      paymentProvider: 'xendit',
      paymentMethod,
      paymentChannel: paymentChannel || null,
      externalPaymentId: xenditResponse.id,
      externalReferenceId: referenceId,
      amount: Number(order.amount),
      status: 'PENDING',
      qrString,
      qrUrl,
      vaNumber,
      ewalletUrl,
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

  async handleWebhook(payload: WebhookPayload, callbackToken: string) {
    if (!this.#verifyWebhookToken(callbackToken)) {
      throw new Error('Invalid webhook token')
    }

    const { data } = payload

    // Find payment by external_reference_id or external_payment_id
    let payment = await Payment.query()
      .where('external_reference_id', data.reference_id)
      .first()

    if (!payment) {
      payment = await Payment.query()
        .where('external_payment_id', data.id)
        .first()
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
          const affectedRows = await Variant.query({ client: trx })
            .where('product_id', item.productId)
            .whereRaw('stock >= ?', [item.quantity])
            .decrement('stock', item.quantity)

          if (affectedRows[0] === 0) {
            throw new Error(
              `Insufficient stock for product ${item.productId} (requested: ${item.quantity})`
            )
          }
        }
      } else if (mappedStatus === 'FAILED' || mappedStatus === 'EXPIRED') {
        const order = await Order.query({ client: trx })
          .where('id', payment.orderId)
          .firstOrFail()

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

  #verifyWebhookToken(token: string): boolean {
    return token === xenditConfig.webhookToken
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
