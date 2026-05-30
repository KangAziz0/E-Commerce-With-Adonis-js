import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  DashboardStats,
  AdminOrder,
  AdminCustomer,
  AdminPayment,
  AdminShipment,
  InventoryItem,
  Invoice,
  PaginationMeta,
  AdminFilters,
} from "./admin.types";

interface AdminState {
  dashboard: {
    stats: DashboardStats | null;
    loading: boolean;
    error: string | null;
  };
  orders: {
    list: AdminOrder[];
    detail: AdminOrder | null;
    meta: PaginationMeta | null;
    loading: boolean;
    detailLoading: boolean;
    error: string | null;
    filters: AdminFilters;
  };
  customers: {
    list: AdminCustomer[];
    detail: AdminCustomer | null;
    meta: PaginationMeta | null;
    loading: boolean;
    detailLoading: boolean;
    error: string | null;
  };
  payments: {
    list: AdminPayment[];
    meta: PaginationMeta | null;
    loading: boolean;
    error: string | null;
  };
  shipments: {
    list: AdminShipment[];
    meta: PaginationMeta | null;
    loading: boolean;
    error: string | null;
  };
  inventory: {
    list: InventoryItem[];
    meta: PaginationMeta | null;
    loading: boolean;
    error: string | null;
  };
  invoices: {
    list: Invoice[];
    detail: Invoice | null;
    meta: PaginationMeta | null;
    loading: boolean;
    detailLoading: boolean;
    error: string | null;
  };
  actionLoading: boolean;
}

const initialState: AdminState = {
  dashboard: { stats: null, loading: false, error: null },
  orders: {
    list: [],
    detail: null,
    meta: null,
    loading: false,
    detailLoading: false,
    error: null,
    filters: { page: 1, limit: 10 },
  },
  customers: {
    list: [],
    detail: null,
    meta: null,
    loading: false,
    detailLoading: false,
    error: null,
  },
  payments: { list: [], meta: null, loading: false, error: null },
  shipments: { list: [], meta: null, loading: false, error: null },
  inventory: { list: [], meta: null, loading: false, error: null },
  invoices: {
    list: [],
    detail: null,
    meta: null,
    loading: false,
    detailLoading: false,
    error: null,
  },
  actionLoading: false,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    // Dashboard
    fetchDashboardStats(state) {
      state.dashboard.loading = true;
      state.dashboard.error = null;
    },
    fetchDashboardStatsSuccess(state, action: PayloadAction<DashboardStats>) {
      state.dashboard.loading = false;
      state.dashboard.stats = action.payload;
    },
    fetchDashboardStatsFailure(state, action: PayloadAction<string>) {
      state.dashboard.loading = false;
      state.dashboard.error = action.payload;
    },

    // Orders
    fetchOrders(state, _action: PayloadAction<AdminFilters | undefined>) {
      state.orders.loading = true;
      state.orders.error = null;
    },
    fetchOrdersSuccess(
      state,
      action: PayloadAction<{ items: AdminOrder[]; meta: PaginationMeta }>
    ) {
      state.orders.loading = false;
      state.orders.list = action.payload.items;
      state.orders.meta = action.payload.meta;
    },
    fetchOrdersFailure(state, action: PayloadAction<string>) {
      state.orders.loading = false;
      state.orders.error = action.payload;
    },
    setOrderFilters(state, action: PayloadAction<AdminFilters>) {
      state.orders.filters = { ...state.orders.filters, ...action.payload };
    },
    fetchOrderDetail(state, _action: PayloadAction<number>) {
      state.orders.detailLoading = true;
      state.orders.detail = null;
      state.orders.error = null;
    },
    fetchOrderDetailSuccess(state, action: PayloadAction<AdminOrder>) {
      state.orders.detailLoading = false;
      state.orders.detail = action.payload;
    },
    fetchOrderDetailFailure(state, action: PayloadAction<string>) {
      state.orders.detailLoading = false;
      state.orders.error = action.payload;
    },
    updateOrderStatus(
      state,
      _action: PayloadAction<{ id: number; status: string }>
    ) {
      state.actionLoading = true;
    },
    updateOrderStatusSuccess(state) {
      state.actionLoading = false;
    },
    refreshPayment(state, _action: PayloadAction<number>) {
      state.actionLoading = true;
    },
    refreshPaymentDone(state) {
      state.actionLoading = false;
    },
    retryShipment(state, _action: PayloadAction<number>) {
      state.actionLoading = true;
    },
    retryShipmentDone(state) {
      state.actionLoading = false;
    },
    updateTracking(
      state,
      _action: PayloadAction<{ id: number; trackingId: string }>
    ) {
      state.actionLoading = true;
    },
    updateTrackingDone(state) {
      state.actionLoading = false;
    },

    // Customers
    fetchCustomers(state, _action: PayloadAction<AdminFilters | undefined>) {
      state.customers.loading = true;
      state.customers.error = null;
    },
    fetchCustomersSuccess(
      state,
      action: PayloadAction<{ items: AdminCustomer[]; meta: PaginationMeta }>
    ) {
      state.customers.loading = false;
      state.customers.list = action.payload.items;
      state.customers.meta = action.payload.meta;
    },
    fetchCustomersFailure(state, action: PayloadAction<string>) {
      state.customers.loading = false;
      state.customers.error = action.payload;
    },
    fetchCustomerDetail(state, _action: PayloadAction<number>) {
      state.customers.detailLoading = true;
      state.customers.detail = null;
      state.customers.error = null;
    },
    fetchCustomerDetailSuccess(state, action: PayloadAction<AdminCustomer>) {
      state.customers.detailLoading = false;
      state.customers.detail = action.payload;
    },
    fetchCustomerDetailFailure(state, action: PayloadAction<string>) {
      state.customers.detailLoading = false;
      state.customers.error = action.payload;
    },
    toggleCustomerActive(state, _action: PayloadAction<number>) {
      state.actionLoading = true;
    },
    toggleCustomerActiveDone(state) {
      state.actionLoading = false;
    },

    // Payments
    fetchPayments(state, _action: PayloadAction<AdminFilters | undefined>) {
      state.payments.loading = true;
      state.payments.error = null;
    },
    fetchPaymentsSuccess(
      state,
      action: PayloadAction<{ items: AdminPayment[]; meta: PaginationMeta }>
    ) {
      state.payments.loading = false;
      state.payments.list = action.payload.items;
      state.payments.meta = action.payload.meta;
    },
    fetchPaymentsFailure(state, action: PayloadAction<string>) {
      state.payments.loading = false;
      state.payments.error = action.payload;
    },
    refreshPaymentStatus(state, _action: PayloadAction<number>) {
      state.actionLoading = true;
    },
    refreshPaymentStatusDone(state) {
      state.actionLoading = false;
    },

    // Shipments
    fetchShipments(state, _action: PayloadAction<AdminFilters | undefined>) {
      state.shipments.loading = true;
      state.shipments.error = null;
    },
    fetchShipmentsSuccess(
      state,
      action: PayloadAction<{ items: AdminShipment[]; meta: PaginationMeta }>
    ) {
      state.shipments.loading = false;
      state.shipments.list = action.payload.items;
      state.shipments.meta = action.payload.meta;
    },
    fetchShipmentsFailure(state, action: PayloadAction<string>) {
      state.shipments.loading = false;
      state.shipments.error = action.payload;
    },
    refreshShipmentTracking(state, _action: PayloadAction<number>) {
      state.actionLoading = true;
    },
    refreshShipmentTrackingDone(state) {
      state.actionLoading = false;
    },
    retryShipmentCreation(state, _action: PayloadAction<number>) {
      state.actionLoading = true;
    },
    retryShipmentCreationDone(state) {
      state.actionLoading = false;
    },

    // Inventory
    fetchInventory(state, _action: PayloadAction<AdminFilters | undefined>) {
      state.inventory.loading = true;
      state.inventory.error = null;
    },
    fetchInventorySuccess(
      state,
      action: PayloadAction<{ items: InventoryItem[]; meta: PaginationMeta }>
    ) {
      state.inventory.loading = false;
      state.inventory.list = action.payload.items;
      state.inventory.meta = action.payload.meta;
    },
    fetchInventoryFailure(state, action: PayloadAction<string>) {
      state.inventory.loading = false;
      state.inventory.error = action.payload;
    },
    updateStock(
      state,
      _action: PayloadAction<{ variantId: number; stock: number }>
    ) {
      state.actionLoading = true;
    },
    updateStockDone(state) {
      state.actionLoading = false;
    },

    // Invoices
    fetchInvoices(state, _action: PayloadAction<AdminFilters | undefined>) {
      state.invoices.loading = true;
      state.invoices.error = null;
    },
    fetchInvoicesSuccess(
      state,
      action: PayloadAction<{ items: Invoice[]; meta: PaginationMeta }>
    ) {
      state.invoices.loading = false;
      state.invoices.list = action.payload.items;
      state.invoices.meta = action.payload.meta;
    },
    fetchInvoicesFailure(state, action: PayloadAction<string>) {
      state.invoices.loading = false;
      state.invoices.error = action.payload;
    },
    fetchInvoiceDetail(state, _action: PayloadAction<number>) {
      state.invoices.detailLoading = true;
      state.invoices.detail = null;
      state.invoices.error = null;
    },
    fetchInvoiceDetailSuccess(state, action: PayloadAction<Invoice>) {
      state.invoices.detailLoading = false;
      state.invoices.detail = action.payload;
    },
    fetchInvoiceDetailFailure(state, action: PayloadAction<string>) {
      state.invoices.detailLoading = false;
      state.invoices.error = action.payload;
    },
  },
});

export const {
  fetchDashboardStats,
  fetchDashboardStatsSuccess,
  fetchDashboardStatsFailure,
  fetchOrders,
  fetchOrdersSuccess,
  fetchOrdersFailure,
  setOrderFilters,
  fetchOrderDetail,
  fetchOrderDetailSuccess,
  fetchOrderDetailFailure,
  updateOrderStatus,
  updateOrderStatusSuccess,
  refreshPayment,
  refreshPaymentDone,
  retryShipment,
  retryShipmentDone,
  updateTracking,
  updateTrackingDone,
  fetchCustomers,
  fetchCustomersSuccess,
  fetchCustomersFailure,
  fetchCustomerDetail,
  fetchCustomerDetailSuccess,
  fetchCustomerDetailFailure,
  toggleCustomerActive,
  toggleCustomerActiveDone,
  fetchPayments,
  fetchPaymentsSuccess,
  fetchPaymentsFailure,
  refreshPaymentStatus,
  refreshPaymentStatusDone,
  fetchShipments,
  fetchShipmentsSuccess,
  fetchShipmentsFailure,
  refreshShipmentTracking,
  refreshShipmentTrackingDone,
  retryShipmentCreation,
  retryShipmentCreationDone,
  fetchInventory,
  fetchInventorySuccess,
  fetchInventoryFailure,
  updateStock,
  updateStockDone,
  fetchInvoices,
  fetchInvoicesSuccess,
  fetchInvoicesFailure,
  fetchInvoiceDetail,
  fetchInvoiceDetailSuccess,
  fetchInvoiceDetailFailure,
} = adminSlice.actions;

export default adminSlice.reducer;
