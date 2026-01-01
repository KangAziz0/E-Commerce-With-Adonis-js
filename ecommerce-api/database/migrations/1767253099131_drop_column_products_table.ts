import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('stock')

      table.decimal('price', 12, 2).nullable().alter()

      // Tambah kategori
      table
        .integer('category_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('categories')
        .onDelete('SET NULL')

      // Tambah SKU
      table.string('sku', 100).nullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      // Kembalikan kolom stock
      table.integer('stock').defaultTo(0)

      // Ubah price kembali not nullable
      table.decimal('price', 12, 2).notNullable().alter()

      // Hapus kolom baru
      table.dropColumn('category_id')
      table.dropColumn('sku')
    })
  }
}
