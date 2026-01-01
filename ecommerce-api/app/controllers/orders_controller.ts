import Cart from '#models/cart'
import type { HttpContext } from '@adonisjs/core/http'
import { errorResponse, successResponse } from '../helpers/response.js'
import Order from '#models/order'
import OrderItem from '#models/order_item'

export default class OrdersController {
  public async create({ request, response }: HttpContext) {
    try {
      const user = request['authenticatedUser']

      const cart = await Cart.query()
        .where('userId', user.id)
        .preload('items', (q) => q.preload('product'))
      if (!cart.length || cart[0].items.length === 0) {
        return response.status(400).json(errorResponse('Cart is empty', 400))
      }

      const total_price = cart[0].items.reduce(
        (sum, item) => sum + item.product.price * item.qty,
        0
      )

      const order = await Order.create({
        userId: user.id,
        status: 'pending',
        total_price,
      })

      for (const item of cart[0].items) {
        await OrderItem.create({
          orderId: order.id,
          productId: item.productId,
          qty: item.qty,
          price: item.product.price,
        })
      }

      // Kosongkan cart setelah order dibuat
      await cart[0].items.forEach(async (item) => await item.delete())

      return response.status(201).json(successResponse('Order created successfully', order))
    } catch (err) {
      return response.status(500).json(errorResponse('Failed to create order'))
    }
  }

  // Lihat order user
  public async index({ request, response }: HttpContext) {
    try {
      const user = request['authenticatedUser']

      const orders = await Order.query()
        .where('userId', user.id)
        .preload('items', (q) => q.preload('product'))
      return response.ok(successResponse('Orders fetched successfully', orders))
    } catch (err) {
      return response.status(500).json(errorResponse('Failed to fetch orders'))
    }
  }

  // Detail order
  public async show({ request, params, response }: HttpContext) {
    try {
      const user = request['authenticatedUser']

      const order = await Order.query()
        .where('id', params.id)
        .andWhere('userId', user.id)
        .preload('items', (q) => q.preload('product'))
        .firstOrFail()

      return response.ok(successResponse('Order fetched successfully', order))
    } catch (err) {
      return response.status(404).json(errorResponse('Order not found', 404))
    }
  }
}
