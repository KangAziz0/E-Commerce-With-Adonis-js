import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'categories'

  async up() {
    this.schema.raw(`
      ALTER TABLE ${this.tableName}
      ADD COLUMN IF NOT EXISTS slug VARCHAR(255),
      ADD COLUMN IF NOT EXISTS description TEXT,
      ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE
    `)

    this.schema.raw(`
      WITH normalized AS (
        SELECT
          id,
          COALESCE(NULLIF(LOWER(REGEXP_REPLACE(TRIM(name), '[^a-zA-Z0-9]+', '-', 'g')), ''), 'category-' || id) AS base_slug,
          ROW_NUMBER() OVER (
            PARTITION BY COALESCE(NULLIF(LOWER(REGEXP_REPLACE(TRIM(name), '[^a-zA-Z0-9]+', '-', 'g')), ''), 'category-' || id)
            ORDER BY id
          ) AS row_number
        FROM ${this.tableName}
      )
      UPDATE ${this.tableName} AS categories
      SET slug = CASE
        WHEN normalized.row_number = 1 THEN normalized.base_slug
        ELSE normalized.base_slug || '-' || normalized.row_number
      END
      FROM normalized
      WHERE categories.id = normalized.id
        AND (categories.slug IS NULL OR categories.slug = '')
    `)

    this.schema.raw(`
      ALTER TABLE ${this.tableName}
      ALTER COLUMN slug SET NOT NULL
    `)

    this.schema.raw(`
      CREATE UNIQUE INDEX IF NOT EXISTS categories_slug_unique
      ON ${this.tableName} (slug)
    `)
  }

  async down() {
    this.schema.raw(`DROP INDEX IF EXISTS categories_slug_unique`)
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('is_active')
      table.dropColumn('description')
      table.dropColumn('slug')
    })
  }
}
