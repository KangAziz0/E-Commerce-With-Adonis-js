import type { HttpContext } from '@adonisjs/core/http'
import { successResponse, errorResponse } from '../../helpers/response.js'
import Order from '#models/order'
import OrderRepository from '#repositories/order_repository'

export default class AdminInvoicesController {
  readonly #orderRepo = new OrderRepository()

  public async index({ request, response }: HttpContext) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 10)

      const orders = await Order.query()
        .whereHas('payments', (query) => {
          query.whereNotNull('id')
        })
        .preload('items')
        .preload('payments')
        .orderBy('created_at', 'desc')
        .paginate(page, limit)

      return response.ok(
        successResponse('Invoices fetched successfully', {
          data: orders.all(),
          meta: orders.getMeta(),
        })
      )
    } catch (error) {
      return response.status(500).json(errorResponse('Failed to fetch invoices'))
    }
  }

  public async show({ params, response }: HttpContext) {
    try {
      const order = await this.#orderRepo.findByIdOrFailWithRelations(params.id)
      return response.ok(successResponse('Invoice fetched successfully', order))
    } catch (error) {
      return response.status(404).json(errorResponse('Invoice not found', 404))
    }
  }
}
