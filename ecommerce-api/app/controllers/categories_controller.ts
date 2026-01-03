import Category from '#models/category'
import type { HttpContext } from '@adonisjs/core/http'
import { errorResponse, successResponse } from '../helpers/response.js'

export default class CategoriesController {
  public async index({ response }: HttpContext) {
    try {
      const categories = await Category.all()
      return response.ok(successResponse('Categories fetched successfully', categories))
    } catch (err) {
      return response.status(500).json(errorResponse('Failed to fetch categories'))
    }
  }

  public async show({ response, params }: HttpContext) {
    try {
      const data = await Category.findOrFail(params.id)
      return response.ok(successResponse('Category fetched successfully', data))
    } catch (error) {
      return response.status(404).json(errorResponse('Category not found', 404))
    }
  }

  public async store({ request, response }: HttpContext) {
    try {
      const data = request.only(['name', 'slug', 'description', 'isActive'])
      const category = await Category.create(data)
      return response.ok(successResponse('Category created successfully', category))
    } catch (error) {
      return response.status(500).json(errorResponse('Failed to create category'))
    }
  }

  public async update({ params, response, request }: HttpContext) {
    try {
      const category = await Category.findOrFail(params.id)
      category.merge(request.only(['name', 'slug', 'description', 'isActive']))
      await category.save()
      return response.ok(successResponse('Category updated successfully', category))
    } catch (error) {
      return response.status(404).json(errorResponse('Category not found', 404))
    }
  }

  public async destroy({ params, response }: HttpContext) {
    try {
      const category = await Category.findOrFail(params.id)
      await category.delete()
      return response.ok(successResponse('Category deleted successfully', null))
    } catch (error) {
      return response.status(404).json(errorResponse('Category not found', 404))
    }
  }
}
