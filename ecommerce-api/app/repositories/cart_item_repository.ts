import BaseRepository from './base_repository.js'
import CartItem from '#models/cart_item'

export default class CartItemRepository extends BaseRepository<CartItem> {
  constructor() {
    super(CartItem)
  }

  async findByCartAndProduct(
    cartId: number,
    productId: number,
    variantId?: number | null,
    size?: string | null,
    color?: string | null
  ): Promise<CartItem | null> {
    const query = CartItem.query().where('cartId', cartId).andWhere('productId', productId)

    if (variantId !== undefined && variantId !== null) {
      query.andWhere('variantId', variantId)
    } else {
      query.andWhereNull('variantId')
    }

    if (size !== undefined && size !== null) {
      query.andWhere('size', size)
    } else {
      query.andWhereNull('size')
    }

    if (color !== undefined && color !== null) {
      query.andWhere('color', color)
    } else {
      query.andWhereNull('color')
    }

    return query.first()
  }

  async findByCartAndIdOrFail(cartId: number, id: number): Promise<CartItem> {
    return CartItem.query().where('id', id).andWhere('cartId', cartId).firstOrFail()
  }

  async deleteByCartId(cartId: number): Promise<void> {
    await CartItem.query().where('cartId', cartId).delete()
  }
}
