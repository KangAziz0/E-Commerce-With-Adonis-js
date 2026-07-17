import BaseRepository from './base_repository.js'
import ProductImage from '#models/product_image'

export default class ProductImageRepository extends BaseRepository<ProductImage> {
  constructor() {
    super(ProductImage)
  }

  async findByProductId(productId: number): Promise<ProductImage[]> {
    return ProductImage.query().where('product_id', productId) as Promise<ProductImage[]>
  }

  async deleteByProductId(productId: number, trx?: any): Promise<void> {
    await ProductImage.query({ client: trx }).where('product_id', productId).delete()
  }

  async createMany(data: Array<Partial<ProductImage>>, trx?: any): Promise<void> {
    await ProductImage.createMany(data, trx ? { client: trx } : undefined)
  }
}
