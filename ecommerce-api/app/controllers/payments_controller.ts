import { PaymentService } from '#services/PaymentService'
import { createPaymentValidator, webhookPaymentValidator } from '#validators/PaymentValidator'
import Payment from '#models/payment'
import xenditConfig from '#config/xendit'
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
      console.error('[PaymentsController.store Error]', message)

      if (message.includes('Order not found')) {
        return response.notFound({ message })
      }

      if (message.includes('not in PENDING status')) {
        return response.badRequest({ message })
      }

      if (message.includes('is required')) {
        return response.badRequest({ message })
      }

      if (message.includes('Xendit API error')) {
        return response.internalServerError({ message: 'Failed to create payment', detail: message })
      }

      return response.internalServerError({ message: 'Failed to create payment', detail: message })
    }
  }

  /**
   * GET /payments/:id/status
   * Get payment status (with ownership check)
   */
  async show({ params, request, response }: HttpContext) {
    try {
      // Load payment with associated order for ownership verification
      const payment = await Payment.query()
        .where('id', params.id)
        .preload('order')
        .first()

      if (!payment) {
        return response.notFound({ message: 'Payment not found' })
      }

      // Ownership check: ensure the authenticated user's email matches the order email
      const user = (request as any).authenticatedUser
      if (user && payment.order && payment.order.email !== user.email) {
        return response.forbidden({ message: 'You are not authorized to view this payment' })
      }

      return response.ok({
        message: 'Payment status retrieved successfully',
        data: {
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
        },
      })
    } catch (error) {
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

    // Verify token BEFORE body validation to reject unauthenticated callers cheaply
    if (webhookToken !== xenditConfig.webhookToken) {
      return response.unauthorized({ message: 'Invalid webhook token' })
    }

    const payload = await request.validateUsing(webhookPaymentValidator)

    try {
      await this.#paymentService.handleWebhook(payload)
      return response.ok({ message: 'Webhook received' })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'

      if (message.includes('Payment not found')) {
        return response.notFound({ message })
      }

      if (message.includes('Amount mismatch')) {
        return response.badRequest({ message })
      }

      console.error('[Webhook Error]', error)
      return response.internalServerError({ message: 'Failed to process webhook', error: message })
    }
  }
}
