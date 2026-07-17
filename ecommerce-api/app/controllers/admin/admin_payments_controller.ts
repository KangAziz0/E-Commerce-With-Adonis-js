import type { HttpContext } from '@adonisjs/core/http'
import { successResponse, errorResponse } from '../../helpers/response.js'
import Payment from '#models/payment'
import PaymentRepository from '#repositories/payment_repository'

export default class AdminPaymentsController {
  readonly #paymentRepo = new PaymentRepository()

  public async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 10)
      const status = request.input('status')
      const paymentMethod = request.input('paymentMethod')
      const paymentChannel = request.input('paymentChannel')

      const query = Payment.query().preload('order')

      if (status) query.where('status', status)
      if (paymentMethod) query.where('paymentMethod', paymentMethod)
      if (paymentChannel) query.where('paymentChannel', paymentChannel)

      query.orderBy('created_at', 'desc')

      const payments = await query.paginate(page, limit)

      return response.ok(
        successResponse('Payments fetched successfully', {
          data: payments.all(),
          meta: payments.getMeta(),
        })
      )
    } catch (error) {
      return response.status(500).json(errorResponse('Failed to fetch payments'))
    }
  }

  public async show({ params, response }: HttpContext) {
    try {
      const payment = await this.#paymentRepo.findByIdOrFailWithOrder(params.id)
      return response.ok(successResponse('Payment fetched successfully', payment))
    } catch (error) {
      return response.status(404).json(errorResponse('Payment not found', 404))
    }
  }

  public async refreshStatus({ params, response }: HttpContext) {
    try {
      const payment = await this.#paymentRepo.findByIdOrFailWithOrder(params.id)
      return response.ok(
        successResponse('Payment status fetched', {
          id: payment.id,
          status: payment.status,
          paymentMethod: payment.paymentMethod,
          paymentChannel: payment.paymentChannel,
          amount: payment.amount,
        })
      )
    } catch (error) {
      return response.status(404).json(errorResponse('Payment not found', 404))
    }
  }
}
