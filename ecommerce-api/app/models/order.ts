import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import OrderItem from '#models/order_item'

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
  declare status: 'PENDING' | 'PAID' | 'EXPIRED' | 'FAILED'

  @hasMany(() => OrderItem)
  declare items: HasMany<typeof OrderItem>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
