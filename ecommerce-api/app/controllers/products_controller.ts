import type { HttpContext } from '@adonisjs/core/http'
import { errorResponse, successResponse } from '../helpers/response.js'
import ProductService from '#services/ProductService'

export default class ProductsController {
  readonly #productService = new ProductService()

  public async index({ request, response }: HttpContext) {
    try {
      const page = Math.max(Number(request.input('page', 1)) || 1, 1)
      const limit = Math.max(Number(request.input('limit', 9)) || 9, 1)
      const search = request.input('search') as string | undefined
      const sortBy = request.input('sort_by', 'created_at')
      const sortOrder = request.input('sort_order', 'desc')

      const result = await this.#productService.getAll(page, limit, search, sortBy, sortOrder)
      return response.ok(successResponse('Products fetched successfully', result))
    } catch (err) {
      return response.status(500).json(errorResponse('Failed to fetch products'))
    }
  }

  public async show({ params, response }: HttpContext) {
    try {
      const product = await this.#productService.getById(params.id)
      if (!product) {
        return response.status(404).json(errorResponse('Product not found', 404))
      }
      return response.ok(successResponse('Product fetched successfully', product))
    } catch (err) {
      return response.status(404).json(errorResponse('Product not found', 404))
    }
  }

  public async store({ request, response }: HttpContext) {
    try {
      const product = await this.#productService.create(request)
      return response.created(successResponse('Product created successfully', product, 201))
    } catch (err) {
      return response.status(500).json(errorResponse('Failed to create product'))
    }
  }

  public async update({ params, request, response }: HttpContext) {
    try {
      if (!Number.isInteger(Number(params.id))) {
        return response.status(400).json(errorResponse('Invalid product id', 400))
      }

      const product = await this.#productService.update(params.id, request)
      return response.ok(successResponse('Product updated successfully', product))
    } catch (err: any) {
      if (err.message === 'Product not found') {
        return response.status(404).json(errorResponse('Product not found', 404))
      }
      if (err.message === 'Category not found' || err.message === 'Brand not found') {
        return response.status(422).json(errorResponse(err.message, 422))
      }
      return response.status(500).json(errorResponse('Failed to update product'))
    }
  }

  public async destroy({ params, response }: HttpContext) {
    try {
      await this.#productService.delete(params.id)
      return response.ok(successResponse('Product deleted successfully', null))
    } catch (err) {
      return response.status(404).json(errorResponse('Product not found', 404))
    }
  }
}
