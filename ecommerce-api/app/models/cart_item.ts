import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Cart from './cart.js'
import Product from './product.js'

export default class CartItem extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare cartId: number

  @column()
  declare productId: number

  @column()
  declare qty: number

  @column()
  declare price: number

  @belongsTo(() => Cart)
  declare cart: BelongsTo<typeof Cart>

  @belongsTo(() => Product)
  declare product: BelongsTo<typeof Product>
}
