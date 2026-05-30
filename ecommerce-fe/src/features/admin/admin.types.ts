export interface PaginationMeta {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
}

export interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalBrands: number;
  ordersByStatus: Record<string, number>;
  totalRevenue: number;
  recentOrders: AdminOrder[];
}

export interface AdminOrder {
  id: number;
  externalId: string;
  email: string;
  amount: number;
  status: string;
  shippingStatus: string | null;
  paymentStatus: string | null;
  createdAt: string;
  updatedAt: string;
  items?: AdminOrderItem[];
  payments?: AdminPayment[];
  shipment?: AdminShipment | null;
}

export interface AdminOrderItem {
  id: number;
  productName: string;
  variantName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface AdminCustomer {
  id: number;
  fullName: string;
  email: string;
  isActive: boolean;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
  orderCount?: number;
  orders?: AdminOrder[];
}

export interface AdminPayment {
  id: number;
  orderId: number;
  orderExternalId?: string;
  externalId: string;
  amount: number;
  status: string;
  paymentMethod: string;
  paymentChannel: string;
  paidAt: string | null;
  expiresAt: string | null;
  createdAt: string;
}

export interface AdminShipment {
  id: number;
  orderId: number;
  orderExternalId?: string;
  courierCompany: string;
  courierType: string;
  trackingId: string | null;
  waybillId: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  trackingHistory?: TrackingEvent[];
}

export interface TrackingEvent {
  date?: string;
  timestamp?: string;
  description?: string;
  note?: string;
  status: string;
}

export interface InventoryItem {
  id: number;
  variantId: number;
  productId: number;
  productName: string;
  variantName: string;
  sku: string | null;
  stock: number;
  price: number;
}

export interface Invoice {
  id: number;
  orderId: number;
  orderExternalId: string;
  email: string;
  amount: number;
  paymentStatus: string;
  createdAt: string;
  items?: AdminOrderItem[];
  payment?: AdminPayment;
  shipment?: AdminShipment | null;
}

export interface AdminFilters {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  sort_by?: string;
  sort_order?: string;
  paymentMethod?: string;
  paymentChannel?: string;
  courierCompany?: string;
  low_stock?: boolean;
}

export interface MonthlyRevenue {
  month: number;
  year: number;
  revenue: number;
}

export interface OrdersByStatusMonthly {
  month: number;
  status: string;
  count: number;
}

export interface TopSellingProduct {
  name: string;
  totalQuantity: number;
}

export interface StatusDistribution {
  status: string;
  count: number;
}

export interface LowStockProduct {
  id: number;
  productId: number;
  name: string;
  stock: number;
  price: number;
}

export interface RecentFailedShipment {
  id: number;
  orderId: number;
  status: string;
  courierCompany: string;
  trackingId: string | null;
  createdAt: string;
}

export interface RecentPendingPayment {
  id: number;
  orderId: number;
  amount: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
}

export interface AnalyticsData {
  monthlyRevenue: MonthlyRevenue[];
  ordersByStatusMonthly: OrdersByStatusMonthly[];
  topSellingProducts: TopSellingProduct[];
  paymentStatusDistribution: StatusDistribution[];
  shipmentStatusDistribution: StatusDistribution[];
  lowStockProducts: LowStockProduct[];
  recentFailedShipments: RecentFailedShipment[];
  recentPendingPayments: RecentPendingPayment[];
}
