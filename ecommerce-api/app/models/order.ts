import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import OrderItem from '#models/order_item'
import Payment from '#models/payment'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare externalId: string

  @column()
  declare email: string

  @column()
  declare amount: number

  @column()
  declare status: 'PENDING' | 'PROCESSING' | 'PAID' | 'EXPIRED' | 'FAILED' | 'CANCELLED'

  @column.dateTime()
  declare paidAt: DateTime | null

  @column()
  declare shippingAmount: number | null

  @column()
  declare courierCompany: string | null

  @column()
  declare courierType: string | null

  @column()
  declare courierServiceName: string | null

  @column()
  declare destinationContactName: string | null

  @column()
  declare destinationContactPhone: string | null

  @column()
  declare destinationAddress: string | null

  @column()
  declare destinationNote: string | null

  @column()
  declare destinationPostalCode: string | null

  @column()
  declare destinationAreaId: string | null

  @column()
  declare originAreaId: string | null

  @column()
  declare biteshipOrderId: string | null

  @column()
  declare waybillId: string | null

  @column()
  declare trackingId: string | null

  @column()
  declare shippingStatus: string | null

  @column()
  declare biteshipRawResponse: Record<string, any> | null

  @hasMany(() => OrderItem)
  declare items: HasMany<typeof OrderItem>

  @hasMany(() => Payment)
  declare payments: HasMany<typeof Payment>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
