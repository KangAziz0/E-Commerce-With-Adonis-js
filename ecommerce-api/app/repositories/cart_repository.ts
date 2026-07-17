import BaseRepository from './base_repository.js'
import Cart from '#models/cart'

export default class CartRepository extends BaseRepository<Cart> {
  constructor() {
    super(Cart)
  }

  async findByUserId(userId: number): Promise<Cart | null> {
    return Cart.query()
      .where('userId', userId)
      .preload('items', (query) => {
        query.preload('product', (productQuery) => {
          productQuery.preload('images')
          productQuery.preload('colors')
          productQuery.preload('variants')
        })
      })
      .first() as Promise<Cart | null>
  }

  async findByUserIdOrCreate(userId: number): Promise<Cart> {
    let cart = await this.findByUserId(userId)
    if (!cart) {
      cart = await Cart.create({ userId })
      await cart.load('items')
    }
    return cart
  }

  async deleteByUserId(userId: number, trx?: any): Promise<void> {
    await Cart.query({ client: trx }).where('userId', userId).delete()
  }
}
