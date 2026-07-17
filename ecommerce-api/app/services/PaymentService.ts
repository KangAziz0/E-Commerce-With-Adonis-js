import { Xendit } from 'xendit-node'
import xenditConfig from '#config/xendit'
import OrderRepository from '#repositories/order_repository'
import PaymentRepository from '#repositories/payment_repository'
import CartRepository from '#repositories/cart_repository'
import UserRepository from '#repositories/user_repository'
import VariantRepository from '#repositories/variant_repository'
import db from '@adonisjs/lucid/services/db'
import type { TransactionClientContract } from '@adonisjs/lucid/types/database'
import { DateTime } from 'luxon'
import env from '#start/env'
import BiteshipService from './BiteshipService.js'
import type { CreateOrderPayload } from '../types/biteship.js'

export interface CreatePaymentInput {
  orderId: number
  paymentMethod: 'QRIS' | 'VIRTUAL_ACCOUNT' | 'EWALLET'
  paymentChannel?: string
}

export interface WebhookPayload {
  event: string
  data: {
    id: string
    reference_id?: string
    payment_request_id?: string
    status: string
    amount: number
    payment_method?: any
    metadata?: any
  }
}

export class PaymentService {
  readonly #xenditClient: InstanceType<typeof Xendit>['PaymentRequest']
  readonly #orderRepo = new OrderRepository()
  readonly #paymentRepo = new PaymentRepository()
  readonly #cartRepo = new CartRepository()
  readonly #userRepo = new UserRepository()
  readonly #variantRepo = new VariantRepository()

  constructor() {
    const xendit = new Xendit({ secretKey: xenditConfig.secretKey })
    this.#xenditClient = xendit.PaymentRequest
  }

  async createPayment(input: CreatePaymentInput) {
    const { orderId, paymentMethod, paymentChannel } = input

    const order = await this.#orderRepo.find(orderId)
    if (!order) {
      throw new Error('Order not found')
    }

    if (order.status !== 'PENDING') {
      throw new Error('Order is not in PENDING status')
    }

    const referenceId = `PAY-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    const amount = Number(order.amount)

    const data: any = {
      referenceId,
      amount,
      currency: 'IDR',
      country: 'ID',
      paymentMethod: {
        type: 'QR_CODE',
        reusability: 'ONE_TIME_USE',
        qrCode: {
          channelCode: 'QRIS',
        },
      },
      metadata: { orderId: order.id },
    }

    let xenditResponse: any
    try {
      xenditResponse = await this.#xenditClient.createPaymentRequest({ data })
    } catch (xenditError: any) {
      const rawBody = xenditError?.rawResponse?.body
      const errorDetail = rawBody
        ? typeof rawBody === 'string'
          ? rawBody
          : JSON.stringify(rawBody)
        : xenditError?.message || 'Unknown Xendit API error'
      console.error('[Xendit createPaymentRequest Error]', {
        status: xenditError?.status || xenditError?.statusCode,
        errorCode: rawBody?.errorCode || rawBody?.error_code,
        message: rawBody?.message,
        requestData: JSON.stringify(data, null, 2),
      })
      throw new Error(`Xendit API error: ${errorDetail}`)
    }

    const { qrString, qrUrl } = this.#extractQRDetails(xenditResponse)
    const expiryDate = this.#extractExpiryDate(xenditResponse)

    const payment = await this.#paymentRepo.create({
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
      vaNumber: null,
      ewalletUrl: null,
      expiryDate,
      rawResponse: xenditResponse as unknown as Record<string, any>,
    } as any)

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
    const payment = await this.#paymentRepo.find(paymentId)
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

    console.log(
      '[Webhook Received]',
      JSON.stringify({
        event: payload.event,
        dataId: data.id,
        referenceId: data.reference_id,
        paymentRequestId: data.payment_request_id,
        status: data.status,
      })
    )

    let payment = null

    if (!payment && data.payment_request_id) {
      payment = await this.#paymentRepo.findByExternalPaymentId(data.payment_request_id)
    }
    if (!payment && data.reference_id) {
      payment = await this.#paymentRepo.findByExternalReferenceId(data.reference_id)
    }
    if (!payment && data.id) {
      payment = await this.#paymentRepo.findByExternalPaymentId(data.id)
    }
    if (!payment && data.metadata?.orderId) {
      payment = await this.#paymentRepo.findPendingByOrderId(data.metadata.orderId)
    }

    if (!payment) {
      console.error('[Webhook] Payment not found for:', {
        id: data.id,
        reference_id: data.reference_id,
        payment_request_id: data.payment_request_id,
      })
      throw new Error('Payment not found')
    }

    if (payment.status === 'PAID') {
      return payment
    }

    const mappedStatus = this.#mapXenditStatus(data.status)

    const trx = await db.transaction()

    let paidOrder: any = null

    try {
      payment.useTransaction(trx)
      payment.status = mappedStatus
      payment.webhookPayload = payload as unknown as Record<string, any>

      if (mappedStatus === 'PAID') {
        payment.paidAt = DateTime.now()
      }

      await payment.save()

      if (mappedStatus === 'PAID') {
        const order = await this.#orderRepo.findByIdOrFailWithItems(payment.orderId, trx)

        if (Math.round(data.amount) !== Math.round(Number(order.amount))) {
          throw new Error(
            `Amount mismatch: webhook amount ${data.amount} does not match order amount ${order.amount}`
          )
        }

        order.status = 'PROCESSING'
        order.paidAt = DateTime.now()
        await order.save()

        await this.#clearCartForOrder(order.email, trx)

        for (const item of order.items) {
          const variantQuery = this.#variantRepo.query().useTransaction(trx) as any
          variantQuery.whereRaw('stock >= ?', [item.quantity])

          if (item.variantId) {
            variantQuery.where('id', item.variantId)
          } else {
            variantQuery.where('product_id', item.productId)
          }

          const variantToDecrement = await variantQuery.first()

          if (!variantToDecrement) {
            throw new Error(
              `Insufficient stock for order item ${item.id} (requested: ${item.quantity})`
            )
          }

          await (this.#variantRepo.query().useTransaction(trx) as any)
            .where('id', (variantToDecrement as any).id)
            .decrement('stock', item.quantity)
        }

        paidOrder = order
      } else if (mappedStatus === 'FAILED' || mappedStatus === 'EXPIRED') {
        const order = await this.#orderRepo.findByIdOrFailWithItems(payment.orderId, trx)
        order.status = mappedStatus === 'FAILED' ? 'FAILED' : 'EXPIRED'
        await order.save()
      }

      await trx.commit()
    } catch (error) {
      await trx.rollback()
      throw error
    }

    if (paidOrder && paidOrder.courierCompany && !paidOrder.biteshipOrderId) {
      await this.#createBiteshipShipment(paidOrder)
    }

    return payment
  }

  #extractQRDetails(xenditResponse: any) {
    let qrString: string | null = null
    let qrUrl: string | null = null

    const qrCode = xenditResponse.paymentMethod?.qrCode
    if (qrCode?.channelProperties?.qrString) {
      qrString = qrCode.channelProperties.qrString
    }

    if (!qrString && xenditResponse.actions?.length) {
      for (const action of xenditResponse.actions) {
        if (action.action === 'PRESENT_TO_CUSTOMER' || action.urlType === 'QR_STRING') {
          qrString = action.qrCode || action.qrString || null
          qrUrl = action.url || null
          break
        }
      }
    }

    return { qrString, qrUrl }
  }

  #extractExpiryDate(xenditResponse: any): DateTime | null {
    if (xenditResponse.actions?.length) {
      const expiry = xenditResponse.actions[0]?.expiresAt || xenditResponse.actions[0]?.expires_at
      if (expiry) {
        return DateTime.fromISO(expiry)
      }
    }
    return DateTime.now().plus({ hours: 24 })
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

  async #clearCartForOrder(email: string, trx: TransactionClientContract) {
    const user = await this.#userRepo.findByEmail(email)
    if (!user) return
    await this.#cartRepo.deleteByUserId(user.id, trx)
  }

  async #createBiteshipShipment(order: any) {
    try {
      if (!order.destinationAddress || !order.destinationContactPhone) {
        console.warn(
          `[Biteship] Skipping shipment for order #${order.id}: missing destinationAddress or destinationContactPhone`
        )
        return
      }

      const biteshipService = new BiteshipService()

      const storeName = env.get('STORE_NAME') || 'Toko Online'
      const storePhone = env.get('STORE_PHONE') || '08123456789'
      const storeEmail = env.get('STORE_EMAIL') || 'store@example.com'
      const storeAddress = env.get('STORE_ADDRESS') || 'Jl. Toko Online No. 1'
      const storePostalCode = env.get('STORE_POSTAL_CODE') || '10110'

      const payload: CreateOrderPayload = {
        shipper_contact_name: storeName,
        shipper_contact_phone: storePhone,
        shipper_contact_email: storeEmail,
        shipper_organization: storeName,
        origin_contact_name: storeName,
        origin_contact_phone: storePhone,
        origin_address: storeAddress,
        origin_postal_code: storePostalCode,
        origin_area_id: order.originAreaId || undefined,
        destination_contact_name: order.destinationContactName || 'Customer',
        destination_contact_phone: order.destinationContactPhone,
        destination_address: order.destinationAddress,
        destination_postal_code: order.destinationPostalCode || '',
        destination_area_id: order.destinationAreaId || undefined,
        destination_note: order.destinationNote || undefined,
        courier_company: order.courierCompany!,
        courier_type: order.courierType || 'REG',
        delivery_type: 'now',
        order_note: `Order #${order.id}`,
        metadata: { orderId: order.id },
        items: order.items.map((item: any) => ({
          name: item.name,
          description: item.name,
          value: Number(item.price),
          length: 10,
          width: 10,
          height: 10,
          weight: 500,
          quantity: item.quantity,
        })),
      }

      const response = await biteshipService.createOrder(payload)

      await this.#orderRepo.updateBiteshipFields(order.id, {
        biteshipOrderId: response.id,
        waybillId: response.waybill_id,
        trackingId: response.tracking_id,
        shippingStatus: response.status,
        biteshipRawResponse: JSON.stringify(response),
      })

      console.log(`[Biteship] Shipment created for order #${order.id}: ${response.id}`)
    } catch (error: any) {
      console.error(
        `[Biteship] Failed to create shipment for order #${order.id}:`,
        error?.message || error
      )
    }
  }
}
