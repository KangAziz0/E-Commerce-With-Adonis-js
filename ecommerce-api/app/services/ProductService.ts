import ProductRepository from '#repositories/product_repository'
import ProductImageRepository from '#repositories/product_image_repository'
import CategoryRepository from '#repositories/category_repository'
import BrandRepository from '#repositories/brand_repository'
import ProductTransformer from '#transformers/product_transformer'
import db from '@adonisjs/lucid/services/db'
import type { ProductVariantPayload } from '#repositories/product_repository'

export default class ProductService {
  readonly #productRepo = new ProductRepository()
  readonly #imageRepo = new ProductImageRepository()
  readonly #categoryRepo = new CategoryRepository()
  readonly #brandRepo = new BrandRepository()

  private getProductData(request: any) {
    const data = request.only(['name', 'description', 'price', 'sku'])
    const categoryId = request.input('category_id')
    const brandId = request.input('brand_id')
    const rawIsActive = request.input('is_active', request.input('isActive'))
    const isActive =
      typeof rawIsActive === 'undefined'
        ? undefined
        : typeof rawIsActive === 'boolean'
          ? rawIsActive
          : !['false', '0', 'off'].includes(String(rawIsActive).toLowerCase())

    return {
      ...data,
      ...(typeof isActive === 'undefined' ? {} : { isActive }),
      categoryId: categoryId ? Number(categoryId) : null,
      brandId: brandId ? Number(brandId) : null,
    }
  }

  private getImageUrls(request: any): string[] {
    const imageUrls = request.input('image_urls')
    if (Array.isArray(imageUrls)) {
      return imageUrls.filter(
        (url: any): url is string => typeof url === 'string' && url.trim() !== ''
      )
    }
    const imageUrl = request.input('image_url')
    return typeof imageUrl === 'string' && imageUrl.trim() !== '' ? [imageUrl] : []
  }

  private getVariants(request: any): ProductVariantPayload[] {
    const variants = request.input('variants')
    if (!Array.isArray(variants)) return []

    return variants
      .filter((v: any) => v && typeof v === 'object')
      .map((variant: any) => ({
        id: Number(variant.id) || undefined,
        name: String(variant.name || '').trim(),
        price: Number(variant.price) || 0,
        stock: Number(variant.stock) || 0,
        isActive: variant.isActive ?? variant.is_active ?? true,
      }))
      .filter((variant: ProductVariantPayload) => variant.name)
  }

  async getAll(
    page: number,
    limit: number,
    search?: string,
    sortBy = 'created_at',
    sortOrder: 'asc' | 'desc' = 'desc'
  ) {
    const result = await this.#productRepo.paginateWithFilters(
      page,
      limit,
      search,
      sortBy,
      sortOrder
    )
    return {
      items: ProductTransformer.collection(result.all()),
      meta: {
        total: result.total,
        perPage: result.perPage,
        currentPage: result.currentPage,
        lastPage: result.lastPage,
        hasMorePages: result.hasMorePages,
      },
    }
  }

  async getById(id: number) {
    const product = await this.#productRepo.findByIdWithRelations(id)
    if (!product) return null
    return ProductTransformer.transform(product)
  }

  async create(request: any) {
    const data = this.getProductData(request)
    const imageUrls = this.getImageUrls(request)
    const variants = this.getVariants(request)

    const product = await db.transaction(async (trx) => {
      const created = await this.#productRepo.create({ ...data, client: trx } as any)
      const productId = created.id

      if (imageUrls.length > 0) {
        await this.#imageRepo.deleteByProductId(productId, trx)
        await this.#imageRepo.createMany(
          imageUrls.map((url) => ({ productId, imageUrl: url })),
          trx
        )
      }

      if (variants.length > 0) {
        await this.#productRepo.syncProductVariants(productId, variants, trx)
      }

      return created
    })

    await product.load('images')
    await product.load('variants')
    return ProductTransformer.transform(product)
  }

  async update(id: number, request: any) {
    const product = await this.#productRepo.find(id)
    if (!product) throw new Error('Product not found')

    const data = this.getProductData(request)

    if (data.categoryId !== null) {
      const category = await this.#categoryRepo.find(data.categoryId)
      if (!category) throw new Error('Category not found')
    }
    if (data.brandId !== null) {
      const brand = await this.#brandRepo.find(data.brandId)
      if (!brand) throw new Error('Brand not found')
    }

    const imageUrls = this.getImageUrls(request)
    const variants = this.getVariants(request)

    await db.transaction(async (trx) => {
      product.useTransaction(trx)
      product.merge(data)
      await product.save()

      if (imageUrls.length > 0) {
        await this.#imageRepo.deleteByProductId(product.id, trx)
        await this.#imageRepo.createMany(
          imageUrls.map((url) => ({ productId: product.id, imageUrl: url })),
          trx
        )
      }

      await this.#productRepo.syncProductVariants(product.id, variants, trx)
    })

    await product.load('images')
    await product.load('variants')
    return ProductTransformer.transform(product)
  }

  async delete(id: number) {
    const product = await this.#productRepo.findOrFail(id)
    await this.#productRepo.delete(product)
  }
}
