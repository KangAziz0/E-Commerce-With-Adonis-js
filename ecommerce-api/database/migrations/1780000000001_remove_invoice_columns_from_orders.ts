import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('xendit_invoice_id')
      table.dropColumn('xendit_invoice_url')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('xendit_invoice_id').nullable()
      table.string('xendit_invoice_url').nullable()
    })
  }
}
