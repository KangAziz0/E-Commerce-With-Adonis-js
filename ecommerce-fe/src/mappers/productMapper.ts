import type { ProductAPI } from "@/types/api/product";
import type { Product } from "@/types/ui/product";

const computeRating = (reviews: ProductAPI["reviews"]): number => {
  if (!reviews?.length) return 0;
  return reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
};

const computeBadge = (p: ProductAPI): Product["badge"] => {
  if (p.reviews && p.reviews.length > 3) return "HOT";
  if (p.id > 5) return "NEW";
  return undefined;
};

export const mapProduct = (p: ProductAPI): Product => ({
  id: p.id,
  name: p.name,
  price: Number(p.price),
  category: p.category?.name ?? "",
  brand: p.brand?.name ?? "",
  rating: computeRating(p.reviews),
  colors: (p.colors ?? []).map((c, i) => ({
    name: c.name,
    hex: c.hex,
    image: p.images?.[i]?.imageUrl ?? p.images?.[i] ?? "",
  })),
  badge: computeBadge(p),
  sizes: p.sizes ?? [],
  description: p.description,
  sku: p.sku,
  reviews: (p.reviews ?? []).map((r) => ({
    ...r,
    // TODO: backend should send a real review timestamp.
    date: "2025-01-01",
  })),
});
