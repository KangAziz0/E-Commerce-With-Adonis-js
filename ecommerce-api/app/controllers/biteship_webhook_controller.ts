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
    const webhookToken = request.header('x-biteship-webhook-token')

    if (!webhookToken) {
      return response.unauthorized({ message: 'Invalid webhook token' })
    }

    if (webhookToken !== biteshipConfig.webhookToken) {
      return response.unauthorized({ message: 'Invalid webhook token' })
    }

    const payload = request.body() as BiteshipWebhookPayload
    console.log('[Biteship Webhook]', { order_id: payload.order_id, status: payload.status })

    try {
      await this.#shipmentService.handleWebhook(payload)
      return response.ok({ message: 'Webhook received' })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      console.error('[Biteship Webhook Error]', error)
      return response.internalServerError({ message: 'Failed to process webhook', error: message })
    }
  }
}
