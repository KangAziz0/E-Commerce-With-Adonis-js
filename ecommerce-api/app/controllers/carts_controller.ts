import type { HttpContext } from '@adonisjs/core/http'
import { errorResponse, successResponse } from '../helpers/response.js'
import { storeCartValidator, updateCartValidator } from '#validators/cart_validator'
import CartService from '#services/CartService'

export default class CartController {
  readonly #cartService = new CartService()

  public async index({ request, response }: HttpContext) {
    try {
      const user = request['authenticatedUser']
      const cart = await this.#cartService.getUserCart(user.id)
      return response.ok(successResponse('Cart fetched successfully', cart))
    } catch {
      return response.status(500).json(errorResponse('Failed to fetch cart'))
    }
  }

  public async store({ request, response }: HttpContext) {
    try {
      const user = request['authenticatedUser']
      const payload = await request.validateUsing(storeCartValidator)

      const item = await this.#cartService.addItem(user.id, payload)
      return response.ok(successResponse('Product added to cart', item))
    } catch (err: any) {
      if (err.message?.includes('Variant tidak valid')) {
        return response.status(422).json(errorResponse(err.message, 422))
      }
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

      const item = await this.#cartService.updateItem(user.id, params.id, payload.qty)
      if (item === null) {
        return response.ok(successResponse('Cart item removed'))
      }
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
      await this.#cartService.removeItem(user.id, params.id)
      return response.ok(successResponse('Cart item removed'))
    } catch {
      return response.status(404).json(errorResponse('Cart item not found', 404))
    }
  }

  public async clear({ request, response }: HttpContext) {
    try {
      const user = request['authenticatedUser']
      await this.#cartService.clearCart(user.id)
      return response.ok(successResponse('Cart cleared'))
    } catch {
      return response.status(500).json(errorResponse('Failed to clear cart'))
    }
  }
}
