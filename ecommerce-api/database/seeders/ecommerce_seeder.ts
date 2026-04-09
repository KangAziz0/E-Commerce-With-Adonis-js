import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Database from '@adonisjs/lucid/services/db'

export default class extends BaseSeeder {
  public async run() {
    // Categories
    const [category] = await Database.table('categories')
      .insert({ name: 'Clothing' })
      .returning('*')

    // Brands
    const [brand] = await Database.table('brands').insert({ name: 'Zara' }).returning('*')

    const sizes = ['XS', 'S', 'M', 'L', 'XL']

    for (let i = 1; i <= 10; i++) {
      // 🔥 Product
      const [product] = await Database.table('products')
        .insert({
          name: `Piqué Biker Jacket ${i}`,
          price: (50 + Math.random() * 50).toFixed(2),
          description: 'Premium biker jacket for modern style.',
          sku: `ZR-PBJ-00${i}`,
          category_id: category.id,
          brand_id: brand.id,
        })
        .returning('*')

      // 🔥 Sizes
      for (const size of sizes) {
        await Database.table('product_sizes').insert({
          product_id: product.id,
          size,
        })
      }

      // 🔥 Colors
      const [color1] = await Database.table('product_colors')
        .insert({
          product_id: product.id,
          name: 'Khaki',
          hex: '#b5945e',
        })
        .returning('*')

      const [color2] = await Database.table('product_colors')
        .insert({
          product_id: product.id,
          name: 'Navy',
          hex: '#2c3e6b',
        })
        .returning('*')

      // 🔥 Images
      await Database.table('product_images').insert([
        {
          product_id: product.id,
          color_id: color1.id,
          image_url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80',
        },
        {
          product_id: product.id,
          color_id: color2.id,
          image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
        },
      ])

      // 🔥 Reviews
      await Database.table('reviews').insert({
        product_id: product.id,
        author: 'John Doe',
        rating: Math.floor(Math.random() * 5) + 1,
        comment: 'Nice product, worth the price!',
        date: '2025-01-01',
      })
    }
  }
}
