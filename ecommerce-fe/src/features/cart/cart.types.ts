export interface CartItem {
  id: number;
  productId: number;
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
  name: string;
  price: number;
  quantity: number;
  weight: number;
  size?: string;
  color?: string;
  image?: string;
}
