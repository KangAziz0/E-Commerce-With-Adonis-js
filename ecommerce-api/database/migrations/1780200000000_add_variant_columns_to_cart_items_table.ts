import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cart_items'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('size').nullable()
      table.string('color').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('size')
      table.dropColumn('color')
    })
  }
}
