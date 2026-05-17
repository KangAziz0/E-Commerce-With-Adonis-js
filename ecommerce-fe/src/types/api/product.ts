export interface ProductAPI {
  id: number;
  name: string;
  price: number;
  description: string;
  sku: string;
  category: { id: number; name: string };
  brand: { id: number; name: string };
  colors: { id: number; name: string; hex: string }[];
  sizes: Array<{ id: number; size: string; weight: number }>;
  images:
    | string[]
    | Array<{
        id: number;
        imageUrl: string;
      }>;
  reviews: { id: number; author: string; rating: number; comment: string }[];
}

export interface ProductListMeta {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  hasMorePages: boolean;
}

export type ProductSortBy =
  | "latest"
  | "price_asc"
  | "price_desc"
  | "rating_desc";

export interface FetchProductsParams {
  page?: number;
  limit?: number;
  append?: boolean;
  search?: string;
  sortBy?: ProductSortBy;
}
