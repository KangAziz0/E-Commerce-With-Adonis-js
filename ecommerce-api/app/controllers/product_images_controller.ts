import ProductImage from '#models/product_image'
import type { HttpContext } from '@adonisjs/core/http'
import { errorResponse, successResponse } from '../helpers/response.js'

export default class ProductImagesController {
  public async store({ params, request, response }: HttpContext) {
    try {
      const data = request.only(['image_url', 'is_primary'])
      data.product_id = params.productId
      const image = await ProductImage.create(data)
      return response.ok(successResponse('Product image created successfully', image))
    } catch (error) {
      return response.status(500).json(errorResponse('Failed to create product image'))
    }
  }

  public async destroy({ params, response }: HttpContext) {
    try {
      const image = await ProductImage.findOrFail(params.id)
      await image.delete()
      return response.ok(successResponse('Product image deleted successfully', null))
    } catch (error) {
      return response.status(404).json(errorResponse('Product image not found', 404))
    }
  }
}
