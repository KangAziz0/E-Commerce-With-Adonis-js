import VariantRepository from '#repositories/variant_repository'

export default class VariantService {
  readonly #variantRepo = new VariantRepository()

  async getByProductId(productId: number) {
    return this.#variantRepo.findByProductId(productId)
  }

  async getByProductAndId(productId: number, id: number) {
    return this.#variantRepo.findByProductAndIdOrFail(productId, id)
  }

  async create(productId: number, data: any) {
    data.product_id = productId
    return this.#variantRepo.create(data)
  }

  async update(productId: number, id: number, data: any) {
    const variant = await this.#variantRepo.findByProductAndIdOrFail(productId, id)
    return this.#variantRepo.update(variant, data)
  }

  async delete(productId: number, id: number) {
    const variant = await this.#variantRepo.findByProductAndIdOrFail(productId, id)
    await this.#variantRepo.delete(variant)
  }
}
