import { Xendit, Invoice as XenditInvoice } from 'xendit-node'
import xenditConfig from '#config/xendit'
import Order from '#models/order'
import Payment from '#models/payment'
import Variant from '#models/variant'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

export interface OrderItem {
  id: number
  name: string
  price: number
  quantity: number
}

export interface CreateInvoicePayload {
  items: OrderItem[]
  email: string
}

export interface WebhookPayload {
  id: string
  external_id: string
  status: string
  amount: number
  payer_email?: string
  payment_method?: string
  payment_channel?: string
  paid_at?: string
  paid_amount?: number
}

export class XenditService {
  readonly #client: XenditInvoice

  constructor() {
    const xendit = new Xendit({ secretKey: xenditConfig.secretKey })
    this.#client = xendit.Invoice
  }

  async createInvoice(payload: CreateInvoicePayload) {
    const { items, email } = payload

    const amount = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const externalId = `INV-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

    // 1. Simpan order ke DB dulu dengan status PENDING
    const order = await Order.create({ externalId, email, amount, status: 'PENDING' })

    // 2. Simpan items
    await order.related('items').createMany(
      items.map((item) => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }))
    )

    // 3. Buat invoice ke Xendit
    const invoiceRequest = {
      externalId,
      amount,
      payerEmail: email,
      description: `Order ${externalId}`,
      items: items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        category: 'Product',
      })),
      currency: 'IDR',
      successRedirectUrl: xenditConfig.successRedirectUrl,
      failureRedirectUrl: xenditConfig.failureRedirectUrl,
    }

    const invoice = await this.#client.createInvoice({ data: invoiceRequest })

    // 4. Update order dengan data dari Xendit
    await order
      .merge({
        xenditInvoiceId: invoice.id,
        xenditInvoiceUrl: invoice.invoiceUrl,
      })
      .save()

    return {
      invoiceId: invoice.id,
      externalId: invoice.externalId,
      invoiceUrl: invoice.invoiceUrl,
      amount: invoice.amount,
      status: invoice.status,
      expiryDate: invoice.expiryDate,
    }
  }

  async handleWebhookStatus(payload: WebhookPayload) {
    const order = await Order.query()
      .where('external_id', payload.external_id)
      .preload('items')
      .first()

    if (!order) {
      throw new Error(`Order not found for external_id: ${payload.external_id}`)
    }

    // Idempotency: if order is already in a terminal state, return early
    if (['PAID', 'EXPIRED', 'FAILED'].includes(order.status)) {
      return order
    }

    // Validate amount matches (use integer comparison to avoid float precision issues)
    if (Math.round(payload.amount) !== Math.round(order.amount)) {
      throw new Error(
        `Amount mismatch: webhook amount ${payload.amount} does not match order amount ${order.amount}`
      )
    }

    const status = payload.status as 'PAID' | 'EXPIRED' | 'FAILED'

    // Wrap in a transaction for atomicity
    const trx = await db.transaction()

    try {
      // Update order status
      order.useTransaction(trx)

      if (status === 'PAID') {
        order.status = 'PAID'
        order.paidAt = payload.paid_at
          ? DateTime.fromISO(payload.paid_at)
          : DateTime.now()
        await order.save()

        // Reduce stock on variants for each order item
        // NOTE: OrderItem only has productId (no variantId), so this decrements
        // all variants for the product. A future improvement should add variantId
        // to OrderItem and target the specific variant SKU.
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
      } else if (status === 'EXPIRED' || status === 'FAILED') {
        order.status = status
        await order.save()
      }

      // Create payment record
      await Payment.create(
        {
          orderId: order.id,
          externalId: payload.external_id,
          invoiceId: payload.id,
          paymentMethod: payload.payment_method || 'unknown',
          paymentStatus: payload.status,
          amount: payload.amount,
          rawResponse: payload as unknown as Record<string, any>,
        },
        { client: trx }
      )

      await trx.commit()
      return order
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  async getInvoice(invoiceId: string) {
    return this.#client.getInvoiceById({ invoiceId })
  }

  async expireInvoice(invoiceId: string) {
    return this.#client.expireInvoice({ invoiceId })
  }

  verifyWebhookToken(token: string): boolean {
    return token === xenditConfig.webhookToken
  }
}
