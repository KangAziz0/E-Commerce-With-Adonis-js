import Product from '#models/product'
import type { HttpContext } from '@adonisjs/core/http'
import { errorResponse, successResponse } from '../helpers/response.js'

export default class ProductsController {
  public async index({ response }: HttpContext) {
    try {
      const products = await Product.all()
      return response.ok(successResponse('Products fetched successfully', products))
    } catch (err) {
      return response.status(500).json(errorResponse('Failed to fetch products'))
    }
  }

  public async show({ params, response }: HttpContext) {
    try {
      const product = await Product.findOrFail(params.id)
      return response.ok(successResponse('Product fetched successfully', product))
    } catch (err) {
      return response.status(404).json(errorResponse('Product not found', 404))
    }
  }

  public async store({ request, response }: HttpContext) {
    try {
      const data = request.only(['name', 'description', 'price', 'stock', 'imageUrl', 'isActive'])
      const product = await Product.create(data)
      return response.created(successResponse('Product created successfully', product, 201))
    } catch (err) {
      return response.status(500).json(errorResponse('Failed to create product'))
    }
  }

  public async update({ params, request, response }: HttpContext) {
    try {
      const product = await Product.findOrFail(params.id)
      const data = request.only(['name', 'description', 'price', 'stock', 'imageUrl', 'isActive'])
      product.merge(data)
      await product.save()
      return response.ok(successResponse('Product updated successfully', product))
    } catch (err) {
      return response.status(404).json(errorResponse('Product not found', 404))
    }
  }

  public async destroy({ params, response }: HttpContext) {
    try {
      const product = await Product.findOrFail(params.id)
      await product.delete()
      return response.ok(successResponse('Product deleted successfully', null))
    } catch (err) {
      return response.status(404).json(errorResponse('Product not found', 404))
    }
  }
}
