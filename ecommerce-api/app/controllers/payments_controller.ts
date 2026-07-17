import { PaymentService } from '#services/PaymentService'
import { createPaymentValidator, webhookPaymentValidator } from '#validators/payment_validator'
import PaymentRepository from '#repositories/payment_repository'
import xenditConfig from '#config/xendit'
import type { HttpContext } from '@adonisjs/core/http'

export default class PaymentsController {
  readonly #paymentService: PaymentService
  readonly #paymentRepo = new PaymentRepository()

  constructor() {
    this.#paymentService = new PaymentService()
  }

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

      if (message.includes('Order not found')) return response.notFound({ message })
      if (message.includes('not in PENDING status')) return response.badRequest({ message })
      if (message.includes('is required')) return response.badRequest({ message })
      if (message.includes('Xendit API error'))
        return response.internalServerError({
          message: 'Failed to create payment',
          detail: message,
        })

      return response.internalServerError({ message: 'Failed to create payment', detail: message })
    }
  }

  async show({ params, request, response }: HttpContext) {
    try {
      const payment = await this.#paymentRepo.findByIdWithOrder(params.id)

      if (!payment) {
        return response.notFound({ message: 'Payment not found' })
      }

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

  async webhook({ request, response }: HttpContext) {
    const webhookToken = request.header('x-callback-token')

    if (!webhookToken) {
      return response.unauthorized({ message: 'Invalid webhook token' })
    }

    if (webhookToken !== xenditConfig.webhookToken) {
      return response.unauthorized({ message: 'Invalid webhook token' })
    }

    const rawBody = request.body()
    console.log('[Webhook Raw Payload]', JSON.stringify(rawBody))

    const payload = await request.validateUsing(webhookPaymentValidator)

    const enrichedPayload = {
      ...payload,
      data: {
        ...payload.data,
        payment_request_id: rawBody?.data?.payment_request_id || payload.data.payment_request_id,
        metadata: rawBody?.data?.metadata || payload.data.metadata,
      },
    }

    try {
      console.log('[Webhook Payload]', JSON.stringify(enrichedPayload))
      await this.#paymentService.handleWebhook(enrichedPayload)
      return response.ok({ message: 'Webhook received' })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'

      if (message.includes('Payment not found')) return response.notFound({ message })
      if (message.includes('Amount mismatch')) return response.badRequest({ message })

      console.error('[Webhook Error]', error)
      return response.internalServerError({ message: 'Failed to process webhook', error: message })
    }
  }
}
