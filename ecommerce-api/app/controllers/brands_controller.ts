import type { HttpContext } from '@adonisjs/core/http'
import { errorResponse, successResponse } from '../helpers/response.js'
import BrandService from '#services/BrandService'

export default class BrandsController {
  readonly #brandService = new BrandService()

  public async index({ response }: HttpContext) {
    try {
      const brands = await this.#brandService.getAll()
      return response.ok(successResponse('Brands fetched successfully', brands))
    } catch (err) {
      return response.status(500).json(errorResponse('Failed to fetch brands'))
    }
  }

  public async show({ response, params }: HttpContext) {
    try {
      const brand = await this.#brandService.getById(params.id)
      return response.ok(successResponse('Brand fetched successfully', brand))
    } catch (error) {
      return response.status(404).json(errorResponse('Brand not found', 404))
    }
  }

  public async store({ request, response }: HttpContext) {
    try {
      const data = request.only(['name'])
      const brand = await this.#brandService.create(data)
      return response.created(successResponse('Brand created successfully', brand, 201))
    } catch (error) {
      return response.status(500).json(errorResponse('Failed to create brand'))
    }
  }

  public async update({ params, response, request }: HttpContext) {
    try {
      const data = request.only(['name'])
      const brand = await this.#brandService.update(params.id, data)
      return response.ok(successResponse('Brand updated successfully', brand))
    } catch (error) {
      return response.status(404).json(errorResponse('Brand not found', 404))
    }
  }

  public async destroy({ params, response }: HttpContext) {
    try {
      await this.#brandService.delete(params.id)
      return response.ok(successResponse('Brand deleted successfully', null))
    } catch (error: any) {
      if (error.message?.includes('used by')) {
        return response.status(409).json(errorResponse(error.message, 409))
      }
      return response.status(404).json(errorResponse('Brand not found', 404))
    }
  }
}
