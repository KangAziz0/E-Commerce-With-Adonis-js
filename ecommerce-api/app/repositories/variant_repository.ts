import BaseRepository from './base_repository.js'
import Variant from '#models/variant'

export default class VariantRepository extends BaseRepository<Variant> {
  constructor() {
    super(Variant)
  }

  async findByProductId(productId: number): Promise<Variant[]> {
    return Variant.query().where('product_id', productId) as Promise<Variant[]>
  }

  async findByProductAndId(productId: number, id: number): Promise<Variant | null> {
    return Variant.query()
      .where('product_id', productId)
      .andWhere('id', id)
      .first() as Promise<Variant | null>
  }

  async findByProductAndIdOrFail(productId: number, id: number): Promise<Variant> {
    return Variant.query()
      .where('product_id', productId)
      .andWhere('id', id)
      .firstOrFail() as Promise<Variant>
  }

  async decrementStock(variantId: number, quantity: number, trx?: any): Promise<number[]> {
    const query = Variant.query({ client: trx })
      .where('id', variantId)
      .whereRaw('stock >= ?', [quantity])
    return query.decrement('stock', quantity)
  }

  async incrementStock(variantId: number, quantity: number, trx?: any): Promise<void> {
    const variant = await Variant.query({ client: trx }).where('id', variantId).first()
    if (variant) {
      variant.stock += quantity
      await variant.save()
    }
  }
}
