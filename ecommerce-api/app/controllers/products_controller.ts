import Product from '#models/product'
import ProductImage from '#models/product_image'
import type { HttpContext } from '@adonisjs/core/http'
import { errorResponse, successResponse } from '../helpers/response.js'
import ProductTransformer from '../transformers/product_transformer.js'

export default class ProductsController {
  private getImageUrls(request: HttpContext['request']) {
    const imageUrls = request.input('image_urls')
    if (Array.isArray(imageUrls)) {
      return imageUrls.filter((url): url is string => typeof url === 'string' && url.trim() !== '')
    }

    const imageUrl = request.input('image_url')
    return typeof imageUrl === 'string' && imageUrl.trim() !== '' ? [imageUrl] : []
  }

  private async syncProductImages(productId: number, imageUrls: string[]) {
    await ProductImage.query().where('product_id', productId).delete()

    if (imageUrls.length === 0) return

    await ProductImage.createMany(
      imageUrls.map((imageUrl) => ({
        productId,
        imageUrl,
      }))
    )
  }

  public async index({ request, response }: HttpContext) {
    try {
      const page = Math.max(Number(request.input('page', 1)) || 1, 1)
      const limit = Math.max(Number(request.input('limit', 9)) || 9, 1)
      const search = request.input('search') as string | undefined
      const sortBy = request.input('sort_by', 'created_at')
      const sortOrder = request.input('sort_order', 'desc')

      const products = await Product.query()
        .preload('category', (q) => q.select('id', 'name'))
        .preload('brand', (q) => q.select('id', 'name'))
        .preload('colors')
        .preload('sizes')
        .preload('images')
        .preload('reviews')
        .if(search, (query) => {
          query.whereILike('name', `%${search}%`)
        })
        .orderBy(sortBy, sortOrder)
        .paginate(page, limit)

      const transformedProducts = ProductTransformer.collection(products.all())

      return response.ok(
        successResponse('Products fetched successfully', {
          items: transformedProducts,
          meta: {
            total: products.total,
            perPage: products.perPage,
            currentPage: products.currentPage,
            lastPage: products.lastPage,
            hasMorePages: products.hasMorePages,
          },
        })
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
        'category_id',
        'brand_id',
      ])
      const imageUrls = this.getImageUrls(request)
      const product = await Product.create(data)
      await this.syncProductImages(product.id, imageUrls)
      await product.load('images')
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
        'category_id',
        'brand_id',
      ])
      const imageUrls = this.getImageUrls(request)
      product.merge(data)
      await product.save()
      await this.syncProductImages(product.id, imageUrls)
      await product.load('images')
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
