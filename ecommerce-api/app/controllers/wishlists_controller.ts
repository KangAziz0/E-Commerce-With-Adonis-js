import type { HttpContext } from '@adonisjs/core/http'
import { errorResponse, successResponse } from '../helpers/response.js'
import WishlistService from '#services/WishlistService'

export default class WishlistsController {
  readonly #wishlistService = new WishlistService()

  public async index({ request, response }: HttpContext) {
    const user = request['authenticatedUser']
    try {
      const data = await this.#wishlistService.getUserWishlist(user.id)
      return response.ok(successResponse('Wishlist fetched successfully', data))
    } catch {
      return response.status(500).json(errorResponse('Failed to fetch wishlist'))
    }
  }

  public async store({ request, response }: HttpContext) {
    const user = request['authenticatedUser']
    try {
      const { productId } = request.only(['productId'])
      const item = await this.#wishlistService.add(user.id, productId)
      return response.ok(successResponse('Product added to wishlist', item))
    } catch {
      return response.status(500).json(errorResponse('Failed to add product to wishlist'))
    }
  }

  public async destroy({ request, params, response }: HttpContext) {
    const user = request['authenticatedUser']
    try {
      await this.#wishlistService.remove(user.id, params.productId)
      return response.ok(successResponse('Product removed from wishlist'))
    } catch {
      return response.status(404).json(errorResponse('Wishlist item not found', 404))
    }
  }
}
