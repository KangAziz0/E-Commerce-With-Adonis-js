import Product from '#models/product'
import type { HttpContext } from '@adonisjs/core/http'
import { errorResponse, successResponse } from '../helpers/response.js'
import ProductTransformer from '../transformers/product_transformer.js'

export default class ProductsController {
  public async index({ response }: HttpContext) {
    try {
      const products = await Product.query()
        .preload('category', (q) => q.select('id', 'name'))
        .preload('brand', (q) => q.select('id', 'name'))
        .preload('colors')
        .preload('sizes')
        .preload('images')
        .preload('reviews')
      return response.ok(
        successResponse('Products fetched successfully', ProductTransformer.collection(products))
      )
    } catch (err) {
      return response.status(500).json(errorResponse('Failed to fetch products'))
    }
  }

  public async show({ params, response }: HttpContext) {
    try {
      const product = await Product.query()
        .preload('category', (q) => q.select('id', 'name'))
        .preload('brand', (q) => q.select('id', 'name'))
        .preload('colors')
        .preload('sizes')
        .preload('images')
        .preload('reviews')
        .where('id', params.id)
        .first()
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
      const data = request.only([
        'name',
        'description',
        'is_active',
        'price',
        'sku',
        'image_url',
        'category_id',
      ])
      const product = await Product.create(data)
      return response.created(successResponse('Product created successfully', product, 201))
    } catch (err) {
      return response.status(500).json(errorResponse('Failed to create product'))
    }
  }

  public async update({ params, request, response }: HttpContext) {
    try {
      const product = await Product.findOrFail(params.id)
      const data = request.only([
        'name',
        'description',
        'is_active',
        'price',
        'sku',
        'image_url',
        'category_id',
      ])
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
