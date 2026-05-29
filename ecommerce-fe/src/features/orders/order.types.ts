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
  status:
    | "PENDING"
    | "PROCESSING"
    | "PAID"
    | "EXPIRED"
    | "FAILED"
    | "CANCELLED";
  paidAt?: string | null;
  items: OrderItem[];
  payments?: {
    id: number;
    paymentMethod: string;
    paymentChannel: string | null;
    amount: number;
    status: "PENDING" | "PAID" | "EXPIRED" | "FAILED" | "CANCELLED";
    externalReferenceId?: string | null;
    expiryDate?: string | null;
    paidAt?: string | null;
  }[];
}

export type OrderStatus =
  | "idle"
  | "loading"
  | "redirecting"
  | "success"
  | "failed";
