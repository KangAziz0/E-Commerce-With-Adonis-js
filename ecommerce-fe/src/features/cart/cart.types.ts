export interface CartItem {
  id: number;
  productId: number;
  variantId?: number | null;
  name: string;
  price: number;
  quantity: number;
  weight: number;
  size?: string;
  color?: string;
  image?: string;
}

export interface AddToCartPayload {
  productId: number;
  variantId?: number | null;
  name: string;
  price: number;
  quantity: number;
  weight: number;
  size?: string;
  color?: string;
  image?: string;
}
