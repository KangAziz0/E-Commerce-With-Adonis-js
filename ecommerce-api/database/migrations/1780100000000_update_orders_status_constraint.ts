import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  async up() {
    // Drop the existing check constraint and recreate with all needed statuses
    this.schema.raw(`
      ALTER TABLE "${this.tableName}"
      DROP CONSTRAINT IF EXISTS "orders_status_check"
    `)

    this.schema.raw(`
      ALTER TABLE "${this.tableName}"
      ADD CONSTRAINT "orders_status_check"
      CHECK ("status" IN ('PENDING', 'PROCESSING', 'PAID', 'EXPIRED', 'FAILED', 'CANCELLED'))
    `)
  }

  async down() {
    this.schema.raw(`
      ALTER TABLE "${this.tableName}"
      DROP CONSTRAINT IF EXISTS "orders_status_check"
    `)

    this.schema.raw(`
      ALTER TABLE "${this.tableName}"
      ADD CONSTRAINT "orders_status_check"
      CHECK ("status" IN ('PENDING', 'PAID', 'EXPIRED', 'FAILED'))
    `)
  }
}
