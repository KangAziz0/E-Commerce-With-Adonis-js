export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface OrderDetail {
  id: number;
  externalId: string;
  email: string;
  amount: number;
  status: "PENDING" | "PAID" | "EXPIRED" | "FAILED";
  items: OrderItem[];
}

export type OrderStatus =
  | "idle"
  | "loading"
  | "redirecting"
  | "success"
  | "failed";
