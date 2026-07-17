import CategoryRepository from '#repositories/category_repository'

export default class CategoryService {
  readonly #categoryRepo = new CategoryRepository()

  private serialize(category: any) {
    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      is_active: category.isActive,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    }
  }

  private getPayload(request: any) {
    const name = String(request.input('name') ?? '').trim()
    const rawSlug = String(request.input('slug') ?? '').trim()
    const description = request.input('description')
    const rawIsActive = request.input('is_active', request.input('isActive', true))
    const isActive =
      typeof rawIsActive === 'boolean'
        ? rawIsActive
        : !['false', '0', 'off'].includes(String(rawIsActive).toLowerCase())

    return {
      name,
      slug: rawSlug || this.#categoryRepo.generateSlug(name),
      description:
        typeof description === 'string' && description.trim() !== '' ? description : null,
      isActive,
    }
  }

  async getAll() {
    const categories = await this.#categoryRepo.all()
    return categories.map((c) => this.serialize(c))
  }

  async getById(id: number) {
    if (!Number.isInteger(Number(id))) {
      throw new Error('Invalid category id')
    }
    const category = await this.#categoryRepo.findOrFail(id)
    return this.serialize(category)
  }

  async create(request: any) {
    const data = this.getPayload(request)
    if (!data.name) {
      throw new Error('Category name is required')
    }
    const existing = await this.#categoryRepo.findBySlug(data.slug)
    if (existing) {
      throw new Error('Category slug already exists')
    }
    const category = await this.#categoryRepo.create(data)
    return this.serialize(category)
  }

  async update(id: number, request: any) {
    if (!Number.isInteger(Number(id))) {
      throw new Error('Invalid category id')
    }
    const category = await this.#categoryRepo.findOrFail(id)
    const data = this.getPayload(request)
    if (!data.name) {
      throw new Error('Category name is required')
    }
    const existing = await this.#categoryRepo.findBySlugExcluding(data.slug, category.id)
    if (existing) {
      throw new Error('Category slug already exists')
    }
    const updated = await this.#categoryRepo.update(category, data)
    return this.serialize(updated)
  }

  async delete(id: number) {
    if (!Number.isInteger(Number(id))) {
      throw new Error('Invalid category id')
    }
    const category = await this.#categoryRepo.findOrFail(id)
    const productCount = await this.#categoryRepo.getProductCount(category.id)
    if (productCount > 0) {
      throw new Error(`Cannot delete - category is used by ${productCount} products`)
    }
    await this.#categoryRepo.delete(category)
  }
}
