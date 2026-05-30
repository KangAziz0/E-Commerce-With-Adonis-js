import httpClient from "@/lib/httpClient";
import type { AdminFilters } from "./admin.types";

const adminService = {
  // Dashboard
  getDashboardStats: () => httpClient.get("/admin/dashboard/stats"),

  // Orders
  getOrders: (params?: AdminFilters) =>
    httpClient.get("/admin/orders", { params }),
  getOrder: (id: number) => httpClient.get(`/admin/orders/${id}`),
  updateOrderStatus: (id: number, status: string) =>
    httpClient.put(`/admin/orders/${id}/status`, { status }),
  refreshPayment: (id: number) =>
    httpClient.post(`/admin/orders/${id}/refresh-payment`),
  retryShipment: (id: number) =>
    httpClient.post(`/admin/orders/${id}/retry-shipment`),
  updateTracking: (id: number, trackingId: string) =>
    httpClient.put(`/admin/orders/${id}/tracking`, { trackingId }),

  // Customers
  getCustomers: (params?: AdminFilters) =>
    httpClient.get("/admin/customers", { params }),
  getCustomer: (id: number) => httpClient.get(`/admin/customers/${id}`),
  toggleCustomerActive: (id: number) =>
    httpClient.put(`/admin/customers/${id}/toggle-active`),

  // Payments
  getPayments: (params?: AdminFilters) =>
    httpClient.get("/admin/payments", { params }),
  getPayment: (id: number) => httpClient.get(`/admin/payments/${id}`),
  refreshPaymentStatus: (id: number) =>
    httpClient.post(`/admin/payments/${id}/refresh`),

  // Shipments
  getShipments: (params?: AdminFilters) =>
    httpClient.get("/admin/shipments", { params }),
  getShipment: (id: number) => httpClient.get(`/admin/shipments/${id}`),
  refreshTracking: (id: number) =>
    httpClient.post(`/admin/shipments/${id}/refresh-tracking`),
  retryShipmentCreation: (orderId: number) =>
    httpClient.post(`/admin/shipments/${orderId}/retry`),

  // Inventory
  getInventory: (params?: AdminFilters) =>
    httpClient.get("/admin/inventory", { params }),
  updateStock: (variantId: number, stock: number) =>
    httpClient.put(`/admin/inventory/${variantId}/stock`, { stock }),

  // Invoices
  getInvoices: (params?: AdminFilters) =>
    httpClient.get("/admin/invoices", { params }),
  getInvoice: (id: number) => httpClient.get(`/admin/invoices/${id}`),

  // Analytics
  getAnalytics: () => httpClient.get("/admin/analytics"),
};

export default adminService;
