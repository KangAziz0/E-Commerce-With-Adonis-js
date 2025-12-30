import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import CartItem from './cart_item.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class Cart extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @hasMany(() => CartItem)
  declare items: HasMany<typeof CartItem>
}
