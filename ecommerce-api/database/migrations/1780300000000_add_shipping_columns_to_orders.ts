import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.decimal('shipping_amount', 12, 2).nullable()
      table.string('courier_company').nullable()
      table.string('courier_type').nullable()
      table.string('courier_service_name').nullable()
      table.string('destination_contact_name').nullable()
      table.string('destination_contact_phone').nullable()
      table.text('destination_address').nullable()
      table.text('destination_note').nullable()
      table.string('destination_postal_code').nullable()
      table.string('destination_area_id').nullable()
      table.string('origin_area_id').nullable()
      table.string('biteship_order_id').nullable().unique()
      table.string('waybill_id').nullable()
      table.string('tracking_id').nullable()
      table.string('shipping_status').nullable().defaultTo(null)
      table.jsonb('biteship_raw_response').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('shipping_amount')
      table.dropColumn('courier_company')
      table.dropColumn('courier_type')
      table.dropColumn('courier_service_name')
      table.dropColumn('destination_contact_name')
      table.dropColumn('destination_contact_phone')
      table.dropColumn('destination_address')
      table.dropColumn('destination_note')
      table.dropColumn('destination_postal_code')
      table.dropColumn('destination_area_id')
      table.dropColumn('origin_area_id')
      table.dropColumn('biteship_order_id')
      table.dropColumn('waybill_id')
      table.dropColumn('tracking_id')
      table.dropColumn('shipping_status')
      table.dropColumn('biteship_raw_response')
    })
  }
}
