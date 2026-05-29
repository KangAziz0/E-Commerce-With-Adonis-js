import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'shipments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('order_id').unsigned().references('id').inTable('orders').notNullable()
      table.string('biteship_order_id').notNullable()
      table.string('courier_company').notNullable()
      table.string('courier_type').notNullable()
      table.string('waybill_id').nullable()
      table.string('tracking_id').nullable()
      table.string('status').notNullable()
      table.jsonb('tracking_history').defaultTo('[]')
      table.jsonb('raw_webhook_payload').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
