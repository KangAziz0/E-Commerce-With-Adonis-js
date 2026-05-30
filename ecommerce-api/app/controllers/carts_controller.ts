import Cart from '#models/cart'
import CartItem from '#models/cart_item'
import Variant from '#models/variant'
import type { HttpContext } from '@adonisjs/core/http'
import { errorResponse, successResponse } from '../helpers/response.js'
import { storeCartValidator, updateCartValidator } from '#validators/CartValidator'

export default class CartController {
  public async index({ request, response }: HttpContext) {
    try {
      const user = request['authenticatedUser']

      let cart = await Cart.query()
        .where('userId', user.id)
        .preload('items', (query) => {
          query.preload('product', (productQuery) => {
            productQuery.preload('images')
            productQuery.preload('colors')
            productQuery.preload('variants')
          })
        })
        .first()

      if (!cart) {
        cart = await Cart.create({ userId: user.id })
        await cart.load('items')
      }

      return response.ok(successResponse('Cart fetched successfully', cart))
    } catch {
      return response.status(500).json(errorResponse('Failed to fetch cart'))
    }
  }

  public async store({ request, response }: HttpContext) {
    try {
      const user = request['authenticatedUser']
      const payload = await request.validateUsing(storeCartValidator)

      let cart = await Cart.query().where('userId', user.id).first()
      if (!cart) {
        cart = await Cart.create({ userId: user.id })
      }

      const variant = payload.variantId
        ? await Variant.query()
            .where('id', payload.variantId)
            .where('product_id', payload.productId)
            .where('is_active', true)
            .first()
        : null

      if (payload.variantId && !variant) {
        return response.status(422).json(errorResponse('Variant tidak valid untuk produk ini', 422))
      }

      const unitPrice = variant ? Number(variant.price) : payload.price

      // Check if item with same product, variant, size, and color already exists
      let item = await CartItem.query()
        .where('cartId', cart.id)
        .andWhere('productId', payload.productId)
        .if(payload.variantId, (q) => q.andWhere('variantId', payload.variantId!))
        .if(!payload.variantId, (q) => q.andWhereNull('variantId'))
        .if(payload.size, (q) => q.andWhere('size', payload.size!))
        .if(!payload.size, (q) => q.andWhereNull('size'))
        .if(payload.color, (q) => q.andWhere('color', payload.color!))
        .if(!payload.color, (q) => q.andWhereNull('color'))
        .first()

      if (item) {
        item.qty += payload.qty ?? 1
        item.price = unitPrice
        await item.save()
      } else {
        item = await CartItem.create({
          cartId: cart.id,
          productId: payload.productId,
          variantId: payload.variantId ?? null,
          qty: payload.qty ?? 1,
          price: unitPrice,
          size: payload.size ?? null,
          color: payload.color ?? null,
        })
      }

      await item.load('product', (productQuery) => {
        productQuery.preload('images')
        productQuery.preload('colors')
        productQuery.preload('variants')
      })

      return response.ok(successResponse('Product added to cart', item))
    } catch (err: any) {
      if (err?.messages) {
        return response.status(422).json(errorResponse('Validation failed', 422))
      }
      return response.status(500).json(errorResponse('Failed to add product to cart'))
    }
  }

  public async update({ request, params, response }: HttpContext) {
    try {
      const user = request['authenticatedUser']
      const payload = await request.validateUsing(updateCartValidator)

      const cart = await Cart.query().where('userId', user.id).first()
      if (!cart) {
        return response.status(404).json(errorResponse('Cart not found', 404))
      }

      const item = await CartItem.query()
        .where('id', params.id)
        .andWhere('cartId', cart.id)
        .firstOrFail()

      if (payload.qty <= 0) {
        await item.delete()
        return response.ok(successResponse('Cart item removed'))
      }

      item.qty = payload.qty
      await item.save()

      return response.ok(successResponse('Cart item updated', item))
    } catch (err: any) {
      if (err?.messages) {
        return response.status(422).json(errorResponse('Validation failed', 422))
      }
      return response.status(404).json(errorResponse('Cart item not found', 404))
    }
  }

  public async destroy({ request, params, response }: HttpContext) {
    try {
      const user = request['authenticatedUser']

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
    } catch {
      return response.status(404).json(errorResponse('Cart item not found', 404))
    }
  }

  public async clear({ request, response }: HttpContext) {
    try {
      const user = request['authenticatedUser']

      const cart = await Cart.query().where('userId', user.id).first()
      if (!cart) {
        return response.ok(successResponse('Cart already empty'))
      }

      await CartItem.query().where('cartId', cart.id).delete()
      return response.ok(successResponse('Cart cleared'))
    } catch {
      return response.status(500).json(errorResponse('Failed to clear cart'))
    }
  }
}
