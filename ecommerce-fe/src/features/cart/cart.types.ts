export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  weight: number;
  size?: string;
  color?: string;
  image?: string;
}
