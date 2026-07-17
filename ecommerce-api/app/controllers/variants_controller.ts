import type { HttpContext } from '@adonisjs/core/http'
import { errorResponse, successResponse } from '../helpers/response.js'
import VariantService from '#services/VariantService'

export default class VariantsController {
  readonly #variantService = new VariantService()

  public async index({ response, params }: HttpContext) {
    try {
      const variants = await this.#variantService.getByProductId(params.product_id)
      return response.ok(successResponse('Variant fetched successfully', variants))
    } catch (error) {
      return response.status(404).json(errorResponse('Variant not found', 404))
    }
  }

  public async show({ params, response }: HttpContext) {
    try {
      const variant = await this.#variantService.getByProductAndId(params.product_id, params.id)
      return response.ok(successResponse('Varint fetched successfully', variant))
    } catch (error) {
      return response.status(404).json(errorResponse('Variant not found', 404))
    }
  }

  public async store({ params, request, response }: HttpContext) {
    try {
      const data = request.only(['name', 'price', 'stock', 'is_active'])
      const variant = await this.#variantService.create(params.product_id, data)
      return response.ok(successResponse('Variant created successfully', variant))
    } catch (error) {
      return response.status(500).json(errorResponse('Failed to create variant', 500))
    }
  }

  public async update({ params, request, response }: HttpContext) {
    try {
      const data = request.only(['name', 'price', 'stock', 'is_active'])
      await this.#variantService.update(params.product_id, params.id, data)
      return response.ok(successResponse('Variant updated successfully', null))
    } catch (error) {
      response.status(404).json(errorResponse('Variant not found', 404))
    }
  }

  public async destroy({ params, response }: HttpContext) {
    try {
      await this.#variantService.delete(params.product_id, params.id)
      return response.ok(successResponse('Variant deleted successfully', null))
    } catch (error) {
      return response.status(404).json(errorResponse('Variant not found', 404))
    }
  }
}
