import BrandRepository from '#repositories/brand_repository'

export default class BrandService {
  readonly #brandRepo = new BrandRepository()

  async getAll() {
    return this.#brandRepo.all()
  }

  async getById(id: number) {
    return this.#brandRepo.findOrFail(id)
  }

  async create(data: { name: string }) {
    return this.#brandRepo.create(data)
  }

  async update(id: number, data: { name: string }) {
    const brand = await this.#brandRepo.findOrFail(id)
    return this.#brandRepo.update(brand, data)
  }

  async delete(id: number) {
    const brand = await this.#brandRepo.findOrFail(id)
    const productCount = await this.#brandRepo.getProductCount(brand.id)
    if (productCount > 0) {
      throw new Error(`Cannot delete - brand is used by ${productCount} products`)
    }
    await this.#brandRepo.delete(brand)
  }
}
