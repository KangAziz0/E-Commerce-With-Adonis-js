import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'vouchers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('code', 50).notNullable().unique()
      table.string('name', 255).notNullable()
      table.text('description').nullable()
      table.enum('discount_type', ['percentage', 'fixed']).notNullable()
      table.decimal('discount_value', 12, 2).notNullable()
      table.decimal('minimum_purchase', 12, 2).defaultTo(0).notNullable()
      table.decimal('maximum_discount', 12, 2).nullable()
      table.integer('usage_limit').unsigned().nullable()
      table.integer('used_count').unsigned().defaultTo(0).notNullable()
      table.timestamp('start_date', { useTz: true }).nullable()
      table.timestamp('end_date', { useTz: true }).nullable()
      table.boolean('is_active').defaultTo(true).notNullable()
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
