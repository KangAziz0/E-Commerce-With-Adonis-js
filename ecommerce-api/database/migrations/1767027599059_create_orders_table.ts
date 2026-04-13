import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('external_id').notNullable().unique()
      table.string('xendit_invoice_id').nullable()
      table.string('xendit_invoice_url').nullable()
      table.string('email').notNullable()
      table.decimal('amount', 12, 2).notNullable()
      table.enum('status', ['PENDING', 'PAID', 'EXPIRED', 'FAILED']).defaultTo('PENDING')
      table.timestamps(true, true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
