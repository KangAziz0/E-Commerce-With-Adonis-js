import BaseRepository from './base_repository.js'
import Product from '#models/product'
import Variant from '#models/variant'
import type { TransactionClientContract } from '@adonisjs/lucid/types/database'
import type { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'

export type ProductVariantPayload = {
  id?: number
  name: string
  price: number
  stock: number
  isActive: boolean
}

export default class ProductRepository extends BaseRepository<Product> {
  constructor() {
    super(Product)
  }

  queryWithRelations(): ModelQueryBuilderContract<typeof Product, Product> {
    return Product.query()
      .preload('category', (q) => q.select('id', 'name'))
      .preload('brand', (q) => q.select('id', 'name'))
      .preload('colors')
      .preload('sizes')
      .preload('variants')
      .preload('images')
      .preload('reviews')
  }

  async findByIdWithRelations(id: number): Promise<Product | null> {
    return this.queryWithRelations().where('id', id).first()
  }

  async paginateWithFilters(
    page: number,
    limit: number,
    search?: string,
    sortBy = 'created_at',
    sortOrder: 'asc' | 'desc' = 'desc'
  ) {
    return this.queryWithRelations()
      .if(search, (query) => {
        query.whereILike('name', `%${search}%`)
      })
      .orderBy(sortBy, sortOrder)
      .paginate(page, limit)
  }

  async findActiveVariantsByProductIds(productIds: number[]): Promise<Variant[]> {
    return Variant.query()
      .whereIn('product_id', productIds)
      .where('is_active', true)
      .orderBy('id', 'asc')
  }

  async syncProductVariants(
    productId: number,
    variants: ProductVariantPayload[],
    trx?: TransactionClientContract
  ) {
    const incomingIds = variants.map((v) => v.id).filter((id): id is number => Boolean(id))

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
        const existing = await Variant.query({ client: trx })
          .where('product_id', productId)
          .where('id', variant.id)
          .first()
        if (existing) {
          if (trx) existing.useTransaction(trx)
          existing.merge(payload)
          await existing.save()
          continue
        }
      }

      await Variant.create(payload, trx ? { client: trx } : undefined)
    }
  }
}
