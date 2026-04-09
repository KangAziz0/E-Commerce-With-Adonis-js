// types/api/product.ts
export interface ProductAPI {
  id: number;
  name: string;
  price: number;
  description: string;
  sku: string;

  category: {
    id: number;
    name: string;
  };

  brand: {
    id: number;
    name: string;
  };

  colors: {
    id: number;
    name: string;
    hex: string;
  }[];

  sizes: [];

  images: string;

  reviews: {
    id: number;
    author: string;
    rating: number;
    comment: string;
  }[];
}
