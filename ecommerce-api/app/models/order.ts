import { BaseModel, column, hasMany, hasOne } from '@adonisjs/lucid/orm'
import type { HasMany, HasOne } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import OrderItem from '#models/order_item'
import Payment from '#models/payment'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare externalId: string

  @column()
  declare xenditInvoiceId: string | null

  @column()
  declare xenditInvoiceUrl: string | null

  @column()
  declare email: string

  @column()
  declare amount: number

  @column()
  declare status: 'PENDING' | 'PROCESSING' | 'PAID' | 'EXPIRED' | 'FAILED'

  @column.dateTime()
  declare paidAt: DateTime | null

  @hasMany(() => OrderItem)
  declare items: HasMany<typeof OrderItem>

  @hasOne(() => Payment)
  declare payment: HasOne<typeof Payment>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
