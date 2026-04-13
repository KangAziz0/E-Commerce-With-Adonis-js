import { XenditService } from '#services/XenditService'
import { createInvoiceValidator, webhookValidator } from '#validators/InvoiceValidator'
import type { HttpContext } from '@adonisjs/core/http'

export default class InvoicesController {
  readonly #xenditService: XenditService

  constructor() {
    this.#xenditService = new XenditService()
  }

  /**
   * POST /invoices
   * Create a new Xendit invoice
   */
  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createInvoiceValidator)

    const invoice = await this.#xenditService.createInvoice(payload)

    return response.created({
      message: 'Invoice created successfully',
      data: invoice,
    })
  }

  /**
   * GET /invoices/:id
   * Get invoice by Xendit invoice ID
   */
  async show({ params, response }: HttpContext) {
    const invoice = await this.#xenditService.getInvoice(params.id)

    return response.ok({
      message: 'Invoice retrieved successfully',
      data: invoice,
    })
  }

  /**
   * POST /invoices/:id/expire
   * Expire an invoice manually
   */
  async expire({ params, response }: HttpContext) {
    const invoice = await this.#xenditService.expireInvoice(params.id)

    return response.ok({
      message: 'Invoice expired successfully',
      data: invoice,
    })
  }

  /**
   * POST /webhooks/xendit
   * Handle Xendit payment webhook
   */
  async webhook({ request, response }: HttpContext) {
    const webhookToken = request.header('x-callback-token')

    if (!webhookToken || !this.#xenditService.verifyWebhookToken(webhookToken)) {
      return response.unauthorized({ message: 'Invalid webhook token' })
    }

    const payload = await request.validateUsing(webhookValidator)

    // Update status order di database
    await this.#xenditService.handleWebhookStatus(payload.external_id, payload.status)

    return response.ok({ message: 'Webhook received' })
  }
}
