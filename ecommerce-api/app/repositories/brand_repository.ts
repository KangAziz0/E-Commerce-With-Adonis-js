import BaseRepository from './base_repository.js'
import Brand from '#models/brand'
import Product from '#models/product'

export default class BrandRepository extends BaseRepository<Brand> {
  constructor() {
    super(Brand)
  }

  async findByName(name: string): Promise<Brand | null> {
    return this.findBy('name', name)
  }

  async getProductCount(brandId: number): Promise<number> {
    const result = await Product.query().where('brandId', brandId).count('* as total')
    return Number(result[0].$extras.total)
  }
}
