import { PaymentService } from '#services/PaymentService'
import { createPaymentValidator, webhookPaymentValidator } from '#validators/PaymentValidator'
import type { HttpContext } from '@adonisjs/core/http'

export default class PaymentsController {
  readonly #paymentService: PaymentService

  constructor() {
    this.#paymentService = new PaymentService()
  }

  /**
   * POST /payments/create
   * Create a new payment for an order
   */
  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createPaymentValidator)

    try {
      const payment = await this.#paymentService.createPayment({
        orderId: payload.orderId,
        paymentMethod: payload.paymentMethod as 'QRIS' | 'VIRTUAL_ACCOUNT' | 'EWALLET',
        paymentChannel: payload.paymentChannel,
      })

      return response.created({
        message: 'Payment created successfully',
        data: payment,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'

      if (message.includes('Order not found')) {
        return response.notFound({ message })
      }

      if (message.includes('not in PENDING status')) {
        return response.badRequest({ message })
      }

      if (message.includes('is required')) {
        return response.badRequest({ message })
      }

      return response.internalServerError({ message: 'Failed to create payment' })
    }
  }

  /**
   * GET /payments/:id/status
   * Get payment status
   */
  async show({ params, response }: HttpContext) {
    try {
      const payment = await this.#paymentService.getPaymentStatus(params.id)

      return response.ok({
        message: 'Payment status retrieved successfully',
        data: payment,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'

      if (message.includes('Payment not found')) {
        return response.notFound({ message })
      }

      return response.internalServerError({ message: 'Failed to get payment status' })
    }
  }

  /**
   * POST /webhooks/xendit
   * Handle Xendit payment webhook (public - no auth middleware)
   */
  async webhook({ request, response }: HttpContext) {
    const webhookToken = request.header('x-callback-token')

    if (!webhookToken) {
      return response.unauthorized({ message: 'Invalid webhook token' })
    }

    const payload = await request.validateUsing(webhookPaymentValidator)

    try {
      await this.#paymentService.handleWebhook(payload, webhookToken)
      return response.ok({ message: 'Webhook received' })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'

      if (message.includes('Invalid webhook token')) {
        return response.unauthorized({ message })
      }

      if (message.includes('Payment not found')) {
        return response.notFound({ message })
      }

      if (message.includes('Amount mismatch')) {
        return response.badRequest({ message })
      }

      return response.internalServerError({ message: 'Failed to process webhook' })
    }
  }
}
