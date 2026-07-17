import CartRepository from '#repositories/cart_repository'
import CartItemRepository from '#repositories/cart_item_repository'
import Variant from '#models/variant'

export default class CartService {
  readonly #cartRepo = new CartRepository()
  readonly #cartItemRepo = new CartItemRepository()

  async getUserCart(userId: number) {
    return this.#cartRepo.findByUserIdOrCreate(userId)
  }

  async addItem(
    userId: number,
    payload: {
      productId: number
      variantId?: number
      qty?: number
      price: number
      size?: string
      color?: string
    }
  ) {
    let cart = await this.#cartRepo.findByUserId(userId)
    if (!cart) {
      cart = await this.#cartRepo.create({ userId })
    }

    const variant = payload.variantId
      ? await Variant.query()
          .where('id', payload.variantId)
          .where('product_id', payload.productId)
          .where('is_active', true)
          .first()
      : null

    if (payload.variantId && !variant) {
      throw new Error('Variant tidak valid untuk produk ini')
    }

    const unitPrice = variant ? Number(variant.price) : payload.price

    let item = await this.#cartItemRepo.findByCartAndProduct(
      cart.id,
      payload.productId,
      payload.variantId,
      payload.size,
      payload.color
    )

    if (item) {
      item.qty += payload.qty ?? 1
      item.price = unitPrice
      await item.save()
    } else {
      item = await this.#cartItemRepo.create({
        cartId: cart.id,
        productId: payload.productId,
        variantId: payload.variantId ?? null,
        qty: payload.qty ?? 1,
        price: unitPrice,
        size: payload.size ?? null,
        color: payload.color ?? null,
      })
    }

    await item.load('product', (productQuery: any) => {
      productQuery.preload('images')
      productQuery.preload('colors')
      productQuery.preload('variants')
    })

    return item
  }

  async updateItem(userId: number, itemId: number, qty: number) {
    const cart = await this.#cartRepo.findByUserId(userId)
    if (!cart) {
      throw new Error('Cart not found')
    }

    const item = await this.#cartItemRepo.findByCartAndIdOrFail(cart.id, itemId)

    if (qty <= 0) {
      await this.#cartItemRepo.delete(item)
      return null
    }

    item.qty = qty
    await item.save()
    return item
  }

  async removeItem(userId: number, itemId: number) {
    const cart = await this.#cartRepo.findByUserId(userId)
    if (!cart) {
      throw new Error('Cart not found')
    }
    const item = await this.#cartItemRepo.findByCartAndIdOrFail(cart.id, itemId)
    await this.#cartItemRepo.delete(item)
  }

  async clearCart(userId: number) {
    const cart = await this.#cartRepo.findByUserId(userId)
    if (!cart) return
    await this.#cartItemRepo.deleteByCartId(cart.id)
  }
}
