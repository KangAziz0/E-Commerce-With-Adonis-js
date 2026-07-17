import type { HttpContext } from '@adonisjs/core/http'
import { errorResponse, successResponse } from '../helpers/response.js'
import CategoryService from '#services/CategoryService'

export default class CategoriesController {
  readonly #categoryService = new CategoryService()

  public async index({ response }: HttpContext) {
    try {
      const categories = await this.#categoryService.getAll()
      return response.ok(successResponse('Categories fetched successfully', categories))
    } catch (err) {
      return response.status(500).json(errorResponse('Failed to fetch categories'))
    }
  }

  public async show({ response, params }: HttpContext) {
    try {
      const data = await this.#categoryService.getById(params.id)
      return response.ok(successResponse('Category fetched successfully', data))
    } catch (error: any) {
      if (error.message === 'Invalid category id') {
        return response.status(404).json(errorResponse('Category not found', 404))
      }
      return response.status(404).json(errorResponse('Category not found', 404))
    }
  }

  public async store({ request, response }: HttpContext) {
    try {
      const category = await this.#categoryService.create(request)
      return response.created(successResponse('Category created successfully', category, 201))
    } catch (error: any) {
      if (error.message === 'Category name is required') {
        return response.status(422).json(errorResponse(error.message, 422))
      }
      if (error.message === 'Category slug already exists') {
        return response.status(409).json(errorResponse(error.message, 409))
      }
      console.error('[CategoriesController.store]', error)
      return response.status(500).json(errorResponse('Failed to create category'))
    }
  }

  public async update({ params, response, request }: HttpContext) {
    try {
      const category = await this.#categoryService.update(params.id, request)
      return response.ok(successResponse('Category updated successfully', category))
    } catch (error: any) {
      if (error.message === 'Invalid category id') {
        return response.status(400).json(errorResponse(error.message, 400))
      }
      if (error.message === 'Category name is required') {
        return response.status(422).json(errorResponse(error.message, 422))
      }
      if (error.message === 'Category slug already exists') {
        return response.status(409).json(errorResponse(error.message, 409))
      }
      return response.status(404).json(errorResponse('Category not found', 404))
    }
  }

  public async destroy({ params, response }: HttpContext) {
    try {
      await this.#categoryService.delete(params.id)
      return response.ok(successResponse('Category deleted successfully', null))
    } catch (error: any) {
      if (error.message === 'Invalid category id') {
        return response.status(400).json(errorResponse(error.message, 400))
      }
      if (error.message?.includes('used by')) {
        return response.status(409).json(errorResponse(error.message, 409))
      }
      return response.status(404).json(errorResponse('Category not found', 404))
    }
  }
}
