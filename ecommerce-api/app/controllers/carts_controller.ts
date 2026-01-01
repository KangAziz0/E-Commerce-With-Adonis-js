import Cart from '#models/cart'
import type { HttpContext } from '@adonisjs/core/http'
import { errorResponse, successResponse } from '../helpers/response.js'
import CartItem from '#models/cart_item'

export default class CartController {
  public async index({ request, response }: HttpContext) {
    const user = request['authenticatedUser']

    try {
      const cart = await Cart.query()
        .where('userId', user.id)
        .preload('items', (query) => query.preload('product'))

      return response.ok(successResponse('Cart fetched successfully', cart[0] || null))
    } catch (err) {
      return response.status(500).json(errorResponse('Failed to fetch cart'))
    }
  }

  public async add({ request, response }: HttpContext) {
    try {
      const { productId, qty } = request.only(['productId', 'qty'])
      const user = request['authenticatedUser']

      let cart = await Cart.query().where('userId', user.id).first()
      if (!cart) {
        cart = await Cart.create({ userId: user.id })
      }

      let item = await CartItem.query()
        .where('cartId', cart.id)
        .andWhere('productId', productId)
        .first()

      if (item) {
        item.qty += qty
        await item.save()
      } else {
        item = await CartItem.create({
          cartId: cart.id,
          productId,
          qty,
        })
      }

      return response.ok(successResponse('Product added to cart', item))
    } catch (err) {
      return response.status(500).json(errorResponse('Failed to add product to cart'))
    }
  }

  public async update({ params, request, response }: HttpContext) {
    try {
      const user = request['authenticatedUser']

      const { qty } = request.only(['qty'])
      const item = await CartItem.query()
        .where('id', params.id)
        .andWhere('cartId', user.id)
        .firstOrFail()

      item.qty = qty
      await item.save()

      return response.ok(successResponse('Cart item updated', item))
    } catch (err) {
      return response.status(404).json(errorResponse('Cart item not found', 404))
    }
  }

  public async remove({ request, params, response }: HttpContext) {
    try {
      const user = request['authenticatedUser']

      const item = await CartItem.query()
        .where('id', params.id)
        .andWhere('cartId', user.id)
        .firstOrFail()

      await item.delete()
      return response.ok(successResponse('Cart item removed'))
    } catch (err) {
      return response.status(404).json(errorResponse('Cart item not found', 404))
    }
  }
}
