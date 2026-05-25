import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'payments'

  async up() {
    this.schema.dropTableIfExists(this.tableName)

    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('order_id').unsigned().references('orders.id').onDelete('CASCADE')
      table.string('payment_provider').notNullable().defaultTo('xendit')
      table.string('payment_method').notNullable()
      table.string('payment_channel').nullable()
      table.string('external_payment_id').nullable().unique()
      table.string('external_reference_id').notNullable().unique()
      table.decimal('amount', 12, 2).notNullable()
      table.string('status').notNullable().defaultTo('PENDING')
      table.text('qr_string').nullable()
      table.string('qr_url').nullable()
      table.string('va_number').nullable()
      table.string('ewallet_url').nullable()
      table.timestamp('expiry_date').nullable()
      table.timestamp('paid_at').nullable()
      table.json('raw_response').nullable()
      table.json('webhook_payload').nullable()
      table.timestamps(true, true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
