export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface CreateInvoicePayload {
  items: OrderItem[];
  email: string;
}

export interface InvoiceResponse {
  invoiceId: string;
  externalId: string;
  invoiceUrl: string;
  amount: number;
  status: string;
  expiryDate: string;
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
