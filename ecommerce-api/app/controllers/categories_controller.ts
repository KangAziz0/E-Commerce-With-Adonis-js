import Category from '#models/category'
import Product from '#models/product'
import type { HttpContext } from '@adonisjs/core/http'
import { errorResponse, successResponse } from '../helpers/response.js'

export default class CategoriesController {
  private serialize(category: Category) {
    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      is_active: category.isActive,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    }
  }

  private getPayload(request: HttpContext['request']) {
    const name = String(request.input('name') ?? '').trim()
    const rawSlug = String(request.input('slug') ?? '').trim()
    const description = request.input('description')
    const rawIsActive = request.input('is_active', request.input('isActive', true))
    const isActive =
      typeof rawIsActive === 'boolean'
        ? rawIsActive
        : !['false', '0', 'off'].includes(String(rawIsActive).toLowerCase())

    return {
      name,
      slug: rawSlug || this.generateSlug(name),
      description: typeof description === 'string' && description.trim() !== '' ? description : null,
      isActive,
    }
  }

  private generateSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  public async index({ response }: HttpContext) {
    try {
      const categories = await Category.query().orderBy('created_at', 'desc')
      return response.ok(
        successResponse('Categories fetched successfully', categories.map((category) => this.serialize(category)))
      )
    } catch (err) {
      return response.status(500).json(errorResponse('Failed to fetch categories'))
    }
  }

  public async show({ response, params }: HttpContext) {
    try {
      if (!Number.isInteger(Number(params.id))) {
        return response.status(404).json(errorResponse('Category not found', 404))
      }

      const data = await Category.findOrFail(params.id)
      return response.ok(successResponse('Category fetched successfully', this.serialize(data)))
    } catch (error) {
      return response.status(404).json(errorResponse('Category not found', 404))
    }
  }

  public async store({ request, response }: HttpContext) {
    try {
      const data = this.getPayload(request)
      if (!data.name) {
        return response.status(422).json(errorResponse('Category name is required', 422))
      }

      const existing = await Category.query().where('slug', data.slug).first()
      if (existing) {
        return response.status(409).json(errorResponse('Category slug already exists', 409))
      }

      const category = await Category.create(data)
      return response.created(successResponse('Category created successfully', this.serialize(category), 201))
    } catch (error) {
      console.error('[CategoriesController.store]', error)
      return response.status(500).json(errorResponse('Failed to create category'))
    }
  }

  public async update({ params, response, request }: HttpContext) {
    try {
      if (!Number.isInteger(Number(params.id))) {
        return response.status(400).json(errorResponse('Invalid category id', 400))
      }

      const category = await Category.findOrFail(params.id)
      const data = this.getPayload(request)
      if (!data.name) {
        return response.status(422).json(errorResponse('Category name is required', 422))
      }

      const existing = await Category.query()
        .where('slug', data.slug)
        .whereNot('id', category.id)
        .first()
      if (existing) {
        return response.status(409).json(errorResponse('Category slug already exists', 409))
      }

      category.merge(data)
      await category.save()
      return response.ok(successResponse('Category updated successfully', this.serialize(category)))
    } catch (error) {
      return response.status(404).json(errorResponse('Category not found', 404))
    }
  }

  public async destroy({ params, response }: HttpContext) {
    try {
      if (!Number.isInteger(Number(params.id))) {
        return response.status(400).json(errorResponse('Invalid category id', 400))
      }

      const category = await Category.findOrFail(params.id)

      const productCount = await Product.query().where('categoryId', category.id).count('* as total')
      const count = Number(productCount[0].$extras.total)
      if (count > 0) {
        return response
          .status(409)
          .json(errorResponse(`Cannot delete - category is used by ${count} products`, 409))
      }

      await category.delete()
      return response.ok(successResponse('Category deleted successfully', null))
    } catch (error) {
      return response.status(404).json(errorResponse('Category not found', 404))
    }
  }
}
