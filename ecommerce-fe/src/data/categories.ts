interface Category {
  id: string;
  name: string;
  icon: string;
}

export const categories: Category[] = [
  { id: "all", name: "Semua Produk", icon: "🏪" },
  { id: "fashion", name: "Fashion", icon: "👔" },
  { id: "electronics", name: "Elektronik", icon: "📱" },
  { id: "accessories", name: "Aksesoris", icon: "⌚" },
];
