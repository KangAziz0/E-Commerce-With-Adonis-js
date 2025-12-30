import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'cart_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('cart_id').unsigned().references('carts.id').onDelete('CASCADE')
      table.integer('product_id').unsigned().references('products.id')
      table.integer('qty').defaultTo(1)
      table.decimal('price', 12, 2)
      table.timestamps(true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
