import Wishlist from '#models/wishlist'
import type { HttpContext } from '@adonisjs/core/http'
import { errorResponse, successResponse } from '../helpers/response.js'
import ProductTransformer from '../transformers/product_transformer.js'

export default class WishlistsController {
  public async index({ request, response }: HttpContext) {
    const user = request['authenticatedUser']

    try {
      const wishlist = await Wishlist.query()
        .where('userId', user.id)
        .preload('product', (query) =>
          query
            .preload('category', (q) => q.select('id', 'name'))
            .preload('brand', (q) => q.select('id', 'name'))
            .preload('colors')
            .preload('sizes')
            .preload('images')
            .preload('reviews')
        )
        .orderBy('id', 'desc')

      const data = wishlist.map((item) => ({
        id: item.id,
        product: ProductTransformer.transform(item.product),
      }))

      return response.ok(successResponse('Wishlist fetched successfully', data))
    } catch {
      return response.status(500).json(errorResponse('Failed to fetch wishlist'))
    }
  }

  public async store({ request, response }: HttpContext) {
    const user = request['authenticatedUser']

    try {
      const { productId } = request.only(['productId'])

      const item = await Wishlist.firstOrCreate({ userId: user.id, productId })

      return response.ok(successResponse('Product added to wishlist', item))
    } catch {
      return response.status(500).json(errorResponse('Failed to add product to wishlist'))
    }
  }

  public async destroy({ request, params, response }: HttpContext) {
    const user = request['authenticatedUser']

    try {
      const item = await Wishlist.query()
        .where('userId', user.id)
        .andWhere('productId', Number(params.productId))
        .firstOrFail()

      await item.delete()

      return response.ok(successResponse('Product removed from wishlist'))
    } catch {
      return response.status(404).json(errorResponse('Wishlist item not found', 404))
    }
  }
}
