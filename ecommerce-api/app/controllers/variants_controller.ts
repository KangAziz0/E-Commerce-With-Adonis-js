import Variant from '#models/variant'
import type { HttpContext } from '@adonisjs/core/http'
import { errorResponse, successResponse } from '../helpers/response.js'

export default class VariantsController {
  public async index({ response, params }: HttpContext) {
    try {
      const variants = await Variant.query().where('product_id', params.product_id)
      return response.ok(successResponse('Variant fetched successfully', variants))
    } catch (error) {
      return response.status(404).json(errorResponse('Variant not found', 404))
    }
  }

  public async show({ params, response }: HttpContext) {
    try {
      const variant = await Variant.query()
        .where('product_id', params.product_id)
        .andWhere('id', params.id)
        .firstOrFail()
      return response.ok(successResponse('Varint fetched successfully', variant))
    } catch (error) {
      return response.status(404).json(errorResponse('Variant not found', 404))
    }
  }

  public async store({ params, request, response }: HttpContext) {
    try {
      const data = request.only(['name', 'price', 'stock', 'is_active', 'product_id'])
      data.product_id = params.product_id
      const variant = await Variant.create(data)
      return response.ok(successResponse('Variant created successfully', variant))
    } catch (error) {
      return response.status(500).json(errorResponse('Failed to create variant', 500))
    }
  }

  public async update({ params, request, response }: HttpContext) {
    try {
      const variant = await Variant.query()
        .where('product_id', params.product_id)
        .andWhere('id', params.id)
        .firstOrFail()
      variant.merge(request.only(['name', 'price', 'stock', 'is_active']))
      await variant.save()
      return response.ok(successResponse('Variant updated successfully', null))
    } catch (error) {
      response.status(404).json(errorResponse('Variant not found', 404))
    }
  }

  public async destroy({ params, response }: HttpContext) {
    try {
      const variant = await Variant.query()
        .where('product_id', params.product_id)
        .andWhere('id', params.id)
        .firstOrFail()
      await variant.delete()
      return response.ok(successResponse('Variant deleted successfully', null))
    } catch (error) {
      return response.status(404).json(errorResponse('Variant not found', 404))
    }
  }
}
