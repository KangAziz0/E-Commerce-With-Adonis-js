import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // ubah password jadi nullable
      table.string('password').nullable().alter()

      // tambah kolom is_sso
      table.boolean('is_sso').notNullable().defaultTo(false)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      // balikin password jadi not nullable
      table.string('password').notNullable().alter()

      // hapus kolom is_sso
      table.dropColumn('is_sso')
    })
  }
}
