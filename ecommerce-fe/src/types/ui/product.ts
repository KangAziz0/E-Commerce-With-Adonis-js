export interface ProductColor {
  name: string;
  hex: string;
  image: string;
}

export interface ProductSize {
  id: number;
  size: string;
  weight: number;
}

export interface ProductReview {
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
  originalPrice?: number;
  rating: number;
  category: string;
  categoryId?: number;
  brand: string;
  brandId?: number;
  colors: ProductColor[];
  sizes?: ProductSize[];
  description?: string;
  sku?: string;
  badge?: string;
  reviews?: ProductReview[];
}
