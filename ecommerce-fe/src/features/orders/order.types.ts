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
  shippingAmount: number | null;
  courierCompany: string | null;
  courierType: string | null;
  courierServiceName: string | null;
  biteshipOrderId: string | null;
  waybillId: string | null;
  trackingId: string | null;
  shippingStatus: string | null;
}

export interface OrderDetail {
  id: number;
  externalId: string;
  email: string;
  amount: number;
  paidAt?: string | null;
  status: OrderDetailStatus;
  items: OrderItem[];
  shippingAmount: number | null;
  courierCompany: string | null;
  courierType: string | null;
  courierServiceName: string | null;
  biteshipOrderId: string | null;
  waybillId: string | null;
  trackingId: string | null;
  shippingStatus: string | null;
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

export interface MyOrdersState {
  orders: OrderListItem[];
  loading: boolean;
  error: string | null;
  isOpen: boolean;
}
