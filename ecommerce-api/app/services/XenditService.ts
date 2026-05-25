import { Xendit, Invoice as XenditInvoice } from 'xendit-node'
import xenditConfig from '#config/xendit'
import Order from '#models/order'

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
      invoiceDuration: 10 * 60, // 10 menit
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

  // Dipanggil dari webhook controller saat Xendit callback
  async handleWebhookStatus(externalId: string, status: string) {
    const order = await Order.findByOrFail('external_id', externalId)

    const mappedStatus = (
      ['PAID', 'EXPIRED', 'FAILED'].includes(status) ? status : 'PENDING'
    ) as Order['status']

    await order.merge({ status: mappedStatus }).save()

    return order
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
