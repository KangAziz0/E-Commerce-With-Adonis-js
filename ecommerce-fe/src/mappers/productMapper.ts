import { ProductAPI } from "@/types/api/product";
import { Product } from "@/types/ui/product";

export const mapProduct = (p: ProductAPI): Product => ({
  id: p.id,
  name: p.name,
  price: Number(p.price),

  category: p.category.name,
  brand: p.brand.name,

  rating:
    p.reviews.length > 0
      ? p.reviews.reduce((acc, r) => acc + r.rating, 0) / p.reviews.length
      : 0,

  colors: p.colors.map((c, i) => ({
    name: c.name,
    hex: c.hex,
    image: p.images[i] || "", // ✅ FIX
  })),

  badge: p.reviews.length > 3 ? "HOT" : p.id > 5 ? "NEW" : undefined,

  sizes: p.sizes || [],

  description: p.description,
  sku: p.sku,

  reviews: p.reviews.map((r) => ({
    ...r,
    date: "2025-01-01",
  })),
});
