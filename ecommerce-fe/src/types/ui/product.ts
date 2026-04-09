// types/ui/product.ts
export interface ProductColor {
  name: string;
  hex: string;
  image: string;
}

export interface Review {
  id: number;
  author: string;
  date: string;
  rating: number;
  comment: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  rating: number;
  category: string;
  brand: string;
  colors: ProductColor[];
  sizes?: string[];
  description?: string;
  sku?: string;
  badge?: string;
  reviews?: Review[];
}
