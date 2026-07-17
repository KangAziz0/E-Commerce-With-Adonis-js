import BaseRepository from './base_repository.js'
import Wishlist from '#models/wishlist'
import type { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'

export default class WishlistRepository extends BaseRepository<Wishlist> {
  constructor() {
    super(Wishlist)
  }

  async findByUserAndProduct(userId: number, productId: number): Promise<Wishlist | null> {
    return Wishlist.query().where('userId', userId).andWhere('productId', productId).first()
  }

  async findByUserAndProductOrFail(userId: number, productId: number): Promise<Wishlist> {
    return Wishlist.query()
      .where('userId', userId)
      .andWhere('productId', Number(productId))
      .firstOrFail()
  }

  async firstOrCreate(userId: number, productId: number): Promise<Wishlist> {
    return Wishlist.firstOrCreate({ userId, productId })
  }

  queryUserWishlist(userId: number): ModelQueryBuilderContract<typeof Wishlist, Wishlist> {
    return Wishlist.query().where('userId', userId).orderBy('id', 'desc')
  }
}
