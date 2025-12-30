import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'payments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('order_id').unsigned().references('orders.id').onDelete('CASCADE')
      table.string('external_id').notNullable().unique()
      table.string('invoice_id').nullable()
      table.string('payment_method').notNullable()
      table.string('payment_status').notNullable()
      table.decimal('amount', 12, 2).notNullable()
      table.json('raw_response').nullable()
      table.timestamps(true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
