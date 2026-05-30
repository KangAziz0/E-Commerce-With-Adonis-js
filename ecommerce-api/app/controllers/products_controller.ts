import Product from '#models/product'
import ProductImage from '#models/product_image'
import Variant from '#models/variant'
import type { HttpContext } from '@adonisjs/core/http'
import type { TransactionClientContract } from '@adonisjs/lucid/types/database'
import db from '@adonisjs/lucid/services/db'
import { errorResponse, successResponse } from '../helpers/response.js'
import ProductTransformer from '../transformers/product_transformer.js'

type ProductVariantPayload = {
  id?: number
  name: string
  price: number
  stock: number
  isActive: boolean
}

export default class ProductsController {
  private getProductData(request: HttpContext['request']) {
    const data = request.only(['name', 'description', 'is_active', 'price', 'sku'])
    const categoryId = request.input('category_id')
    const brandId = request.input('brand_id')

    return {
      ...data,
      categoryId: categoryId ? Number(categoryId) : null,
      brandId: brandId ? Number(brandId) : null,
    }
  }

  private getImageUrls(request: HttpContext['request']) {
    const imageUrls = request.input('image_urls')
    if (Array.isArray(imageUrls)) {
      return imageUrls.filter((url): url is string => typeof url === 'string' && url.trim() !== '')
    }

    const imageUrl = request.input('image_url')
    return typeof imageUrl === 'string' && imageUrl.trim() !== '' ? [imageUrl] : []
  }

  private async syncProductImages(
    productId: number,
    imageUrls: string[],
    trx?: TransactionClientContract
  ) {
    await ProductImage.query({ client: trx }).where('product_id', productId).delete()

    if (imageUrls.length === 0) return

    await ProductImage.createMany(
      imageUrls.map((imageUrl) => ({
        productId,
        imageUrl,
      })),
      trx ? { client: trx } : undefined
    )
  }

  private getVariants(request: HttpContext['request']): ProductVariantPayload[] {
    const variants = request.input('variants')
    if (!Array.isArray(variants)) return []

    return variants
      .filter((variant) => variant && typeof variant === 'object')
      .map((variant) => ({
        id: Number(variant.id) || undefined,
        name: String(variant.name || '').trim(),
        price: Number(variant.price) || 0,
        stock: Number(variant.stock) || 0,
        isActive: variant.isActive ?? variant.is_active ?? true,
      }))
      .filter((variant) => variant.name)
  }

  private async syncProductVariants(
    productId: number,
    variants: ProductVariantPayload[],
    trx?: TransactionClientContract
  ) {
    const incomingIds = variants
      .map((variant) => variant.id)
      .filter((id): id is number => Boolean(id))

    if (incomingIds.length > 0) {
      await Variant.query({ client: trx })
        .where('product_id', productId)
        .whereNotIn('id', incomingIds)
        .delete()
    } else {
      await Variant.query({ client: trx }).where('product_id', productId).delete()
    }

    for (const variant of variants) {
      const payload = {
        productId,
        name: variant.name,
        price: variant.price,
        stock: variant.stock,
        isActive: variant.isActive,
      }

      if (variant.id) {
        const existingVariant = await Variant.query({ client: trx })
          .where('product_id', productId)
          .where('id', variant.id)
          .first()

        if (existingVariant) {
          if (trx) existingVariant.useTransaction(trx)
          existingVariant.merge(payload)
          await existingVariant.save()
          continue
        }
      }

      await Variant.create(payload, trx ? { client: trx } : undefined)
    }
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
        .preload('variants')
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
        .preload('variants')
        .preload('images')
        .preload('reviews')
        .where('id', params.id)
        .first()
      if (!product) {
        return response.status(404).json(errorResponse('Product not found', 404))
      }
      return response.ok(successResponse('Product fetched successfully', ProductTransformer.transform(product)))
    } catch (err) {
      return response.status(404).json(errorResponse('Product not found', 404))
    }
  }

  public async store({ request, response }: HttpContext) {
    try {
      const data = this.getProductData(request)
      const imageUrls = this.getImageUrls(request)
      const variants = this.getVariants(request)

      const product = await db.transaction(async (trx) => {
        const createdProduct = await Product.create(data, { client: trx })
        await this.syncProductImages(createdProduct.id, imageUrls, trx)
        await this.syncProductVariants(createdProduct.id, variants, trx)
        return createdProduct
      })

      await product.load('images')
      await product.load('variants')
      return response.created(successResponse('Product created successfully', ProductTransformer.transform(product), 201))
    } catch (err) {
      return response.status(500).json(errorResponse('Failed to create product'))
    }
  }

  public async update({ params, request, response }: HttpContext) {
    try {
      const product = await Product.findOrFail(params.id)
      const data = this.getProductData(request)
      const imageUrls = this.getImageUrls(request)
      const variants = this.getVariants(request)

      await db.transaction(async (trx) => {
        product.useTransaction(trx)
        product.merge(data)
        await product.save()
        await this.syncProductImages(product.id, imageUrls, trx)
        await this.syncProductVariants(product.id, variants, trx)
      })

      await product.load('images')
      await product.load('variants')
      return response.ok(successResponse('Product updated successfully', ProductTransformer.transform(product)))
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
