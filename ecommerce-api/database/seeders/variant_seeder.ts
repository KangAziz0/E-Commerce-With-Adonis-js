import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Database from '@adonisjs/lucid/services/db'

export default class extends BaseSeeder {
  public async run() {
    // Get all products from database
    const products = await Database.from('products').select('id', 'name', 'price')

    const sizes = ['S', 'M', 'L', 'XL']

    for (const product of products) {
      const variants = sizes.map((size) => ({
        product_id: product.id,
        name: `${product.name} - ${size}`,
        price: product.price,
        stock: 50, // default stock 50 per variant
        is_active: true,
      }))

      await Database.table('variants').multiInsert(variants)
    }

    console.log(`✅ Created variants for ${products.length} products (${sizes.length} sizes each)`)
  }
}
