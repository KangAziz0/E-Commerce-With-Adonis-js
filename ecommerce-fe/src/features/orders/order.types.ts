export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export type OrderDetailStatus =
  | "PENDING"
  | "PROCESSING"
  | "PAID"
  | "EXPIRED"
  | "FAILED"
  | "CANCELLED";

export interface OrderListItem {
  id: number;
  externalId: string;
  email: string;
  amount: number;
  status: OrderDetailStatus;
  createdAt: string;
  items: OrderItem[];
}

export interface OrderDetail {
  id: number;
  externalId: string;
  email: string;
  amount: number;
  status: OrderDetailStatus;
  items: OrderItem[];
}

export type OrderStatus =
  | "idle"
  | "loading"
  | "redirecting"
  | "success"
  | "failed";

export interface MyOrdersState {
  orders: OrderListItem[];
  loading: boolean;
  error: string | null;
  isOpen: boolean;
}
