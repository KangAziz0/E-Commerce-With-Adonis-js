import ProductImageRepository from '#repositories/product_image_repository'

export default class ProductImageService {
  readonly #imageRepo = new ProductImageRepository()

  async create(data: { image_url: string; is_primary?: boolean; product_id?: number }) {
    return this.#imageRepo.create(data as any)
  }

  async delete(id: number) {
    const image = await this.#imageRepo.findOrFail(id)
    await this.#imageRepo.delete(image)
  }
}
