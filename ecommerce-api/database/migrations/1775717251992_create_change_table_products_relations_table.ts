import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  public async up() {
    // 🔥 Drop dulu kalau sudah ada (reset)
    this.schema.raw('DROP TABLE IF EXISTS reviews CASCADE')
    this.schema.raw('DROP TABLE IF EXISTS product_images CASCADE')
    this.schema.raw('DROP TABLE IF EXISTS product_colors CASCADE')
    this.schema.raw('DROP TABLE IF EXISTS product_sizes CASCADE')
    this.schema.raw('DROP TABLE IF EXISTS products CASCADE')
    this.schema.raw('DROP TABLE IF EXISTS categories CASCADE')
    this.schema.raw('DROP TABLE IF EXISTS brands CASCADE')

    // ✅ Categories
    this.schema.createTable('categories', (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.timestamps(true)
    })

    // ✅ Brands
    this.schema.createTable('brands', (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.timestamps(true)
    })

    // ✅ Products
    this.schema.createTable('products', (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.decimal('price', 12, 2).nullable()
      table.text('description').nullable()
      table.string('sku').nullable()

      table
        .integer('category_id')
        .unsigned()
        .references('id')
        .inTable('categories')
        .onDelete('SET NULL')

      table.integer('brand_id').unsigned().references('id').inTable('brands').onDelete('SET NULL')

      table.timestamps(true)
    })

    // ✅ Product Sizes
    this.schema.createTable('product_sizes', (table) => {
      table.increments('id')
      table
        .integer('product_id')
        .unsigned()
        .references('id')
        .inTable('products')
        .onDelete('CASCADE')

      table.string('size').notNullable()
    })

    // ✅ Product Colors
    this.schema.createTable('product_colors', (table) => {
      table.increments('id')
      table
        .integer('product_id')
        .unsigned()
        .references('id')
        .inTable('products')
        .onDelete('CASCADE')

      table.string('name').notNullable()
      table.string('hex').nullable()
    })

    // ✅ Product Images
    this.schema.createTable('product_images', (table) => {
      table.increments('id')

      table
        .integer('product_id')
        .unsigned()
        .references('id')
        .inTable('products')
        .onDelete('CASCADE')

      table
        .integer('color_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('product_colors')
        .onDelete('CASCADE')

      table.string('image_url').notNullable()
    })

    // ✅ Reviews
    this.schema.createTable('reviews', (table) => {
      table.increments('id')

      table
        .integer('product_id')
        .unsigned()
        .references('id')
        .inTable('products')
        .onDelete('CASCADE')

      table.string('author').notNullable()
      table.integer('rating').notNullable()
      table.text('comment').nullable()
      table.date('date').nullable()

      table.timestamps(true)
    })
  }

  public async down() {
    // Drop semua (urutan dibalik)
    this.schema.dropTableIfExists('reviews')
    this.schema.dropTableIfExists('product_images')
    this.schema.dropTableIfExists('product_colors')
    this.schema.dropTableIfExists('product_sizes')
    this.schema.dropTableIfExists('products')
    this.schema.dropTableIfExists('categories')
    this.schema.dropTableIfExists('brands')
  }
}
