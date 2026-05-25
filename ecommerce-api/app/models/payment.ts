import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import Order from './order.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED' | 'CANCELLED'
export type PaymentMethod = 'QRIS' | 'VIRTUAL_ACCOUNT' | 'EWALLET'

export default class Payment extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare orderId: number

  @column()
  declare paymentProvider: string

  @column()
  declare paymentMethod: PaymentMethod

  @column()
  declare paymentChannel: string | null

  @column()
  declare externalPaymentId: string | null

  @column()
  declare externalReferenceId: string

  @column()
  declare amount: number

  @column()
  declare status: PaymentStatus

  @column()
  declare qrString: string | null

  @column()
  declare qrUrl: string | null

  @column()
  declare vaNumber: string | null

  @column()
  declare ewalletUrl: string | null

  @column.dateTime()
  declare expiryDate: DateTime | null

  @column.dateTime()
  declare paidAt: DateTime | null

  @column({
    prepare: (value: Record<string, any> | null) => (value ? JSON.stringify(value) : null),
    consume: (value: string | null) => (value ? JSON.parse(value) : null),
  })
  declare rawResponse: Record<string, any> | null

  @column({
    prepare: (value: Record<string, any> | null) => (value ? JSON.stringify(value) : null),
    consume: (value: string | null) => (value ? JSON.parse(value) : null),
  })
  declare webhookPayload: Record<string, any> | null

  @belongsTo(() => Order)
  declare order: BelongsTo<typeof Order>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
