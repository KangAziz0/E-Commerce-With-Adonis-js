import type { HttpContext } from '@adonisjs/core/http'
import Order from '#models/order'

export default class OrdersController {
  async show({ params, response }: HttpContext) {
    const order = await Order.query()
      .where('external_id', params.externalId)
      .preload('items')
      .firstOrFail()

    return response.ok({
      message: 'Order retrieved successfully',
      data: order,
    })
  }

  async paymentStatus({ params, response }: HttpContext) {
    const { orderId } = params

    // Try to find by numeric id first, then by external_id
    const order = await Order.query()
      .where((query) => {
        const numericId = Number(orderId)
        if (!Number.isNaN(numericId) && Number.isInteger(numericId)) {
          query.where('id', numericId)
        }
        query.orWhere('external_id', orderId)
      })
      .first()

    if (!order) {
      return response.notFound({ message: 'Order not found' })
    }

    return response.ok({
      message: 'Payment status retrieved successfully',
      data: {
        status: order.status,
        paidAt: order.paidAt,
        externalId: order.externalId,
        amount: order.amount,
      },
    })
  }
}
