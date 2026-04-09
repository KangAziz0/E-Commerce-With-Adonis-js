import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Product from './product.js'

export default class Review extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare productId: number

  @column()
  declare author: string

  @column()
  declare rating: number

  @column()
  declare comment: string

  @column()
  declare date: string

  @belongsTo(() => Product)
  declare product: BelongsTo<typeof Product>
}
