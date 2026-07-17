import type { HttpContext } from '@adonisjs/core/http'
import { createOrderValidator } from '#validators/order_validator'
import OrderService from '#services/OrderService'

export default class OrdersController {
  readonly #orderService = new OrderService()

  async index({ request, response }: HttpContext) {
    const user = (request as any).authenticatedUser
    if (!user) {
      return response.unauthorized({ message: 'Not authenticated' })
    }
    const orders = await this.#orderService.getUserOrders(user.email)
    return response.ok({ message: 'Orders retrieved successfully', data: orders })
  }

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(createOrderValidator)

    try {
      const result = await this.#orderService.create(payload)
      return response.created({
        message: 'Order created successfully',
        data: result,
      })
    } catch (error: any) {
      if (error.message?.includes('required')) {
        return response.badRequest({ message: error.message })
      }
      if (error.message?.includes('not found')) {
        return response.notFound({ message: error.message })
      }
      if (error.message?.includes('mismatch') || error.message?.includes('required for product')) {
        return response.badRequest({ message: error.message })
      }
      throw error
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const order = await this.#orderService.getByExternalId(params.externalId)
      return response.ok({
        message: 'Order retrieved successfully',
        data: order,
      })
    } catch {
      return response.notFound({ message: 'Order not found' })
    }
  }

  async paymentStatus({ params, request, response }: HttpContext) {
    const { orderId } = params

    try {
      const user = (request as any).authenticatedUser
      const result = await this.#orderService.getPaymentStatus(orderId, user.email)
      return response.ok({
        message: 'Payment status retrieved successfully',
        data: result,
      })
    } catch (error: any) {
      if (error.message === 'Order not found') {
        return response.notFound({ message: 'Order not found' })
      }
      if (error.message === 'Unauthorized') {
        return response.forbidden({ message: 'You are not authorized to view this order' })
      }
      throw error
    }
  }
}
