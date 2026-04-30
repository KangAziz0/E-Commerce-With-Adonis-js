import Product from '#models/product'

export default class ProductTransformer {
  static transform(product: Product) {
    return {
      id: product.id,
      name: product.name,
      price: Number(product.price),
      description: product.description,
      sku: product.sku,
      category: product.category
        ? {
            id: product.category.id,
            name: product.category.name,
          }
        : null,

      brand: product.brand
        ? {
            id: product.brand.id,
            name: product.brand.name,
          }
        : null,

      colors: product.colors?.map((c) => ({
        id: c.id,
        name: c.name,
        hex: c.hex,
      })),

      sizes: product.sizes?.map((s) => ({
        size: s.size,
        weight: s.weight,
      })),

      images: product.images?.map((img) => img.imageUrl),

      reviews: product.reviews?.map((r) => ({
        author: r.author,
        rating: r.rating,
        comment: r.comment,
      })),
    }
  }

  static collection(products: Product[]) {
    return products.map((product) => this.transform(product))
  }
}
