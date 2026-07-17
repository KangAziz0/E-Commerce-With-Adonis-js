import WishlistRepository from '#repositories/wishlist_repository'
import ProductTransformer from '#transformers/product_transformer'
import Wishlist from '#models/wishlist'

export default class WishlistService {
  readonly #wishlistRepo = new WishlistRepository()

  async getUserWishlist(userId: number) {
    const wishlist: Wishlist[] = await this.#wishlistRepo
      .queryUserWishlist(userId)
      .preload('product', (query: any) =>
        query
          .preload('category', (q: any) => q.select('id', 'name'))
          .preload('brand', (q: any) => q.select('id', 'name'))
          .preload('colors')
          .preload('sizes')
          .preload('images')
          .preload('reviews')
      )

    return wishlist.map((item) => ({
      id: item.id,
      product: ProductTransformer.transform(item.product),
    }))
  }

  async add(userId: number, productId: number) {
    return this.#wishlistRepo.firstOrCreate(userId, productId)
  }

  async remove(userId: number, productId: number) {
    const item = await this.#wishlistRepo.findByUserAndProductOrFail(userId, productId)
    await this.#wishlistRepo.delete(item)
  }
}
