import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Order from './order.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Payment extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare orderId: number

  @column()
  declare externalId: number

  @column()
  declare invoiceId: number

  @column()
  declare paymentMethod: number

  @column()
  declare paymentStatus: number

  @column()
  declare amount: number

  @column()
  declare rawResponse: number

  @belongsTo(() => Order)
  declare order: BelongsTo<typeof Order>
}
