import type { HttpContext } from '@adonisjs/core/http'
import biteshipConfig from '#config/biteship'
import ShipmentService from '#services/ShipmentService'
import type { BiteshipWebhookPayload } from '../types/biteship.js'

export default class BiteshipWebhookController {
  readonly #shipmentService: ShipmentService

  constructor() {
    this.#shipmentService = new ShipmentService()
  }

  /**
   * POST /api/webhooks/biteship
   * Handle Biteship shipment tracking webhook (public - no auth middleware)
   */
  async handle({ request, response }: HttpContext) {
    const payload = request.body() as Partial<BiteshipWebhookPayload>
    const isInstallationPing = !payload || Object.keys(payload).length === 0
    const configuredToken = biteshipConfig.webhookToken

    // Biteship sends an empty JSON request when installing a webhook.
    // It expects a 2xx response before real event validation is enabled.
    if (isInstallationPing) {
      return response.ok({ message: 'Biteship webhook endpoint is ready' })
    }

    const webhookToken = request.header('x-biteship-webhook-token')

    if (configuredToken && webhookToken !== configuredToken) {
      return response.unauthorized({ message: 'Invalid webhook token' })
    }

    console.log('[Biteship Webhook]', { order_id: payload.order_id, status: payload.status })

    try {
      await this.#shipmentService.handleWebhook(payload as BiteshipWebhookPayload)
      return response.ok({ message: 'Webhook received' })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      console.error('[Biteship Webhook Error]', error)
      return response.internalServerError({ message: 'Failed to process webhook', error: message })
    }
  }
}
