import Cart from '#models/cart'
import type { HttpContext } from '@adonisjs/core/http'
import { errorResponse, successResponse } from '../helpers/response.js'
import CartItem from '#models/cart_item'

export default class CartController {
  public async index({ auth, response }: HttpContext) {
    try {
      const user = auth.user!

      let cart = await Cart.query()
        .where('userId', user.id)
        .preload('items', (query) => query.preload('product'))
        .first()

      if (!cart) {
        cart = await Cart.create({ userId: user.id })
        await cart.load('items')
      }

      return response.ok(successResponse('Cart fetched successfully', cart))
    } catch (err) {
      return response.status(500).json(errorResponse('Failed to fetch cart'))
    }
  }

  public async store({ auth, request, response }: HttpContext) {
    try {
      const user = auth.user!
      const { productId, qty, price, size, color } = request.only([
        'productId',
        'qty',
        'price',
        'size',
        'color',
      ])

      let cart = await Cart.query().where('userId', user.id).first()
      if (!cart) {
        cart = await Cart.create({ userId: user.id })
      }

      // Check if item with same product, size, and color already exists
      let item = await CartItem.query()
        .where('cartId', cart.id)
        .andWhere('productId', productId)
        .if(size, (q) => q.andWhere('size', size))
        .if(!size, (q) => q.andWhereNull('size'))
        .if(color, (q) => q.andWhere('color', color))
        .if(!color, (q) => q.andWhereNull('color'))
        .first()

      if (item) {
        item.qty += qty || 1
        await item.save()
      } else {
        item = await CartItem.create({
          cartId: cart.id,
          productId,
          qty: qty || 1,
          price,
          size: size || null,
          color: color || null,
        })
      }

      await item.load('product')

      return response.ok(successResponse('Product added to cart', item))
    } catch (err) {
      return response.status(500).json(errorResponse('Failed to add product to cart'))
    }
  }

  public async update({ auth, params, request, response }: HttpContext) {
    try {
      const user = auth.user!
      const { qty } = request.only(['qty'])

      const cart = await Cart.query().where('userId', user.id).first()
      if (!cart) {
        return response.status(404).json(errorResponse('Cart not found', 404))
      }

      const item = await CartItem.query()
        .where('id', params.id)
        .andWhere('cartId', cart.id)
        .firstOrFail()

      if (qty <= 0) {
        await item.delete()
        return response.ok(successResponse('Cart item removed'))
      }

      item.qty = qty
      await item.save()

      return response.ok(successResponse('Cart item updated', item))
    } catch (err) {
      return response.status(404).json(errorResponse('Cart item not found', 404))
    }
  }

  public async destroy({ auth, params, response }: HttpContext) {
    try {
      const user = auth.user!

      const cart = await Cart.query().where('userId', user.id).first()
      if (!cart) {
        return response.status(404).json(errorResponse('Cart not found', 404))
      }

      const item = await CartItem.query()
        .where('id', params.id)
        .andWhere('cartId', cart.id)
        .firstOrFail()

      await item.delete()
      return response.ok(successResponse('Cart item removed'))
    } catch (err) {
      return response.status(404).json(errorResponse('Cart item not found', 404))
    }
  }

  public async clear({ auth, response }: HttpContext) {
    try {
      const user = auth.user!

      const cart = await Cart.query().where('userId', user.id).first()
      if (!cart) {
        return response.ok(successResponse('Cart already empty'))
      }

      await CartItem.query().where('cartId', cart.id).delete()
      return response.ok(successResponse('Cart cleared'))
    } catch (err) {
      return response.status(500).json(errorResponse('Failed to clear cart'))
    }
  }
}
