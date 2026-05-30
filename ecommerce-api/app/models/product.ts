import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

import Category from './category.js'
import Brand from './brand.js'
import ProductColor from './product_color.js'
import ProductSize from './product_size.js'
import Review from './review.js'
import ProductImage from './product_image.js'
import Variant from './variant.js'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare description: string

  @column()
  declare price: number

  @column()
  declare sku: string

  @column()
  declare isActive: boolean

  @column({ columnName: 'category_id' })
  declare categoryId: number

  @column({ columnName: 'brand_id' })
  declare brandId: number

  // 🔗 RELATIONS

  @belongsTo(() => Category, {
    foreignKey: 'categoryId',
  })
  declare category: BelongsTo<typeof Category>

  @belongsTo(() => Brand, {
    foreignKey: 'brandId',
  })
  declare brand: BelongsTo<typeof Brand>

  @hasMany(() => ProductColor)
  declare colors: HasMany<typeof ProductColor>

  @hasMany(() => ProductSize)
  declare sizes: HasMany<typeof ProductSize>

  @hasMany(() => Variant)
  declare variants: HasMany<typeof Variant>

  @hasMany(() => ProductImage)
  declare images: HasMany<typeof ProductImage>

  @hasMany(() => Review)
  declare reviews: HasMany<typeof Review>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
