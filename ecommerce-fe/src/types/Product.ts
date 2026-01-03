import { Category } from "./Category";

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  sku: string;
  image_url: string;
  is_active: boolean;
  category_id?: number | null;
  category?: Category;
  created_at: string;
  updated_at: string;
}
