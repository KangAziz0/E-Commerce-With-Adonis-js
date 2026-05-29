import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import Order from './order.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Shipment extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare orderId: number

  @column()
  declare biteshipOrderId: string

  @column()
  declare courierCompany: string

  @column()
  declare courierType: string

  @column()
  declare waybillId: string | null

  @column()
  declare trackingId: string | null

  @column()
  declare status: string

  @column({
    prepare: (value: Array<Record<string, any>>) => JSON.stringify(value),
    consume: (value: string | Array<Record<string, any>>) => {
      if (!value) return []
      if (Array.isArray(value)) return value
      return JSON.parse(value)
    },
  })
  declare trackingHistory: Array<Record<string, any>>

  @column({
    prepare: (value: Record<string, any> | null) => (value ? JSON.stringify(value) : null),
    consume: (value: string | Record<string, any> | null) => {
      if (!value) return null
      if (typeof value === 'object') return value
      return JSON.parse(value)
    },
  })
  declare rawWebhookPayload: Record<string, any> | null

  @belongsTo(() => Order)
  declare order: BelongsTo<typeof Order>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
