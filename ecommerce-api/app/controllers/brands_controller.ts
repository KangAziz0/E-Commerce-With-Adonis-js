import Brand from '#models/brand'
import Product from '#models/product'
import type { HttpContext } from '@adonisjs/core/http'
import { errorResponse, successResponse } from '../helpers/response.js'

export default class BrandsController {
  public async index({ response }: HttpContext) {
    try {
      const brands = await Brand.all()
      return response.ok(successResponse('Brands fetched successfully', brands))
    } catch (err) {
      return response.status(500).json(errorResponse('Failed to fetch brands'))
    }
  }

  public async show({ response, params }: HttpContext) {
    try {
      const brand = await Brand.findOrFail(params.id)
      return response.ok(successResponse('Brand fetched successfully', brand))
    } catch (error) {
      return response.status(404).json(errorResponse('Brand not found', 404))
    }
  }

  public async store({ request, response }: HttpContext) {
    try {
      const data = request.only(['name'])
      const brand = await Brand.create(data)
      return response.created(successResponse('Brand created successfully', brand, 201))
    } catch (error) {
      return response.status(500).json(errorResponse('Failed to create brand'))
    }
  }

  public async update({ params, response, request }: HttpContext) {
    try {
      const brand = await Brand.findOrFail(params.id)
      brand.merge(request.only(['name']))
      await brand.save()
      return response.ok(successResponse('Brand updated successfully', brand))
    } catch (error) {
      return response.status(404).json(errorResponse('Brand not found', 404))
    }
  }

  public async destroy({ params, response }: HttpContext) {
    try {
      const brand = await Brand.findOrFail(params.id)

      const productCount = await Product.query().where('brandId', brand.id).count('* as total')
      const count = Number(productCount[0].$extras.total)
      if (count > 0) {
        return response
          .status(409)
          .json(errorResponse(`Cannot delete - brand is used by ${count} products`, 409))
      }

      await brand.delete()
      return response.ok(successResponse('Brand deleted successfully', null))
    } catch (error) {
      return response.status(404).json(errorResponse('Brand not found', 404))
    }
  }
}
