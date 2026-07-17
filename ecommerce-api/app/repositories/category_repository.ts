import BaseRepository from './base_repository.js'
import Category from '#models/category'
import Product from '#models/product'

export default class CategoryRepository extends BaseRepository<Category> {
  constructor() {
    super(Category)
  }

  async findBySlug(slug: string): Promise<Category | null> {
    return this.findBy('slug', slug)
  }

  async findBySlugExcluding(slug: string, excludeId: number): Promise<Category | null> {
    return Category.query()
      .where('slug', slug)
      .whereNot('id', excludeId)
      .first() as Promise<Category | null>
  }

  async getProductCount(categoryId: number): Promise<number> {
    const result = await Product.query().where('categoryId', categoryId).count('* as total')
    return Number(result[0].$extras.total)
  }

  generateSlug(value: string): string {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
}
