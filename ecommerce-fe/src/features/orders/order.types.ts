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

export interface TrackingHistoryEntry {
  timestamp: string;
  status: string;
  note: string;
}

export interface Shipment {
  id: number;
  biteshipOrderId: string;
  courierCompany: string;
  courierType: string;
  waybillId: string | null;
  trackingId: string | null;
  status: string;
  trackingHistory: TrackingHistoryEntry[];
  createdAt: string;
  updatedAt: string;
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
  shipment?: Shipment | null;
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
