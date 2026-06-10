import type { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLatest } from "redux-saga/effects";
import type { SagaIterator } from "redux-saga";
import { toast } from "react-toastify";

import { getErrorMessage } from "@/lib/errorMessage";
import adminService from "./adminService";
import type { AnalyticsFilters } from "./adminService";
import type { AdminCustomer, AdminFilters } from "./admin.types";
import {
  fetchDashboardStats,
  fetchDashboardStatsSuccess,
  fetchDashboardStatsFailure,
  fetchDashboardOrders,
  fetchDashboardOrdersSuccess,
  fetchDashboardOrdersFailure,
  fetchOrders,
  fetchOrdersSuccess,
  fetchOrdersFailure,
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
  fetchAnalytics,
  fetchAnalyticsSuccess,
  fetchAnalyticsFailure,
} from "./adminSlice";

// Dashboard
function* fetchDashboardStatsSaga(action: PayloadAction<AnalyticsFilters | undefined>): SagaIterator {
  try {
    const response = yield call(adminService.getDashboardStats, action.payload);
    yield put(fetchDashboardStatsSuccess(response.data?.data ?? response.data));
  } catch (error) {
    yield put(
      fetchDashboardStatsFailure(getErrorMessage(error, "Gagal memuat statistik dashboard"))
    );
  }
}

function* fetchDashboardOrdersSaga(
  action: PayloadAction<AdminFilters | undefined>
): SagaIterator {
  try {
    const response = yield call(adminService.getOrders, action.payload);
    const data = response.data?.data ?? response.data;
    yield put(
      fetchDashboardOrdersSuccess({
        items: data.items ?? data.data ?? [],
        meta: data.meta ?? { total: 0, perPage: 10, currentPage: 1, lastPage: 1 },
      })
    );
  } catch (error) {
    yield put(
      fetchDashboardOrdersFailure(getErrorMessage(error, "Gagal memuat pesanan dashboard"))
    );
  }
}

// Orders
function* fetchOrdersSaga(action: PayloadAction<AdminFilters | undefined>): SagaIterator {
  try {
    const response = yield call(adminService.getOrders, action.payload);
    const data = response.data?.data ?? response.data;
    yield put(
      fetchOrdersSuccess({
        items: data.items ?? data.data ?? [],
        meta: data.meta ?? { total: 0, perPage: 10, currentPage: 1, lastPage: 1 },
      })
    );
  } catch (error) {
    yield put(fetchOrdersFailure(getErrorMessage(error, "Gagal memuat pesanan")));
  }
}

function* fetchOrderDetailSaga(action: PayloadAction<number>): SagaIterator {
  try {
    const response = yield call(adminService.getOrder, action.payload);
    yield put(fetchOrderDetailSuccess(response.data?.data ?? response.data));
  } catch (error) {
    yield put(fetchOrderDetailFailure(getErrorMessage(error, "Gagal memuat detail pesanan")));
  }
}

function* updateOrderStatusSaga(
  action: PayloadAction<{ id: number; status: string }>
): SagaIterator {
  try {
    yield call(adminService.updateOrderStatus, action.payload.id, action.payload.status);
    yield put(updateOrderStatusSuccess());
    toast.success("Status pesanan berhasil diperbarui");
    yield put(fetchOrderDetail(action.payload.id));
  } catch (error) {
    toast.error(getErrorMessage(error, "Gagal memperbarui status pesanan"));
    yield put(updateOrderStatusSuccess());
  }
}

function* refreshPaymentSaga(action: PayloadAction<number>): SagaIterator {
  try {
    yield call(adminService.refreshPayment, action.payload);
    yield put(refreshPaymentDone());
    toast.success("Status pembayaran berhasil diperbarui");
    yield put(fetchOrderDetail(action.payload));
  } catch (error) {
    toast.error(getErrorMessage(error, "Gagal refresh pembayaran"));
    yield put(refreshPaymentDone());
  }
}

function* retryShipmentSaga(action: PayloadAction<number>): SagaIterator {
  try {
    yield call(adminService.retryShipment, action.payload);
    yield put(retryShipmentDone());
    toast.success("Pengiriman berhasil diulang");
    yield put(fetchOrderDetail(action.payload));
  } catch (error) {
    toast.error(getErrorMessage(error, "Gagal mengulang pengiriman"));
    yield put(retryShipmentDone());
  }
}

function* updateTrackingSaga(
  action: PayloadAction<{ id: number; trackingId: string }>
): SagaIterator {
  try {
    yield call(adminService.updateTracking, action.payload.id, action.payload.trackingId);
    yield put(updateTrackingDone());
    toast.success("Tracking number berhasil diperbarui");
    yield put(fetchOrderDetail(action.payload.id));
  } catch (error) {
    toast.error(getErrorMessage(error, "Gagal memperbarui tracking"));
    yield put(updateTrackingDone());
  }
}

// Customers
function* fetchCustomersSaga(action: PayloadAction<AdminFilters | undefined>): SagaIterator {
  try {
    const response = yield call(adminService.getCustomers, action.payload);
    const data = response.data?.data ?? response.data;
    yield put(
      fetchCustomersSuccess({
        items: data.items ?? data.data ?? [],
        meta: data.meta ?? { total: 0, perPage: 10, currentPage: 1, lastPage: 1 },
      })
    );
  } catch (error) {
    yield put(fetchCustomersFailure(getErrorMessage(error, "Gagal memuat pelanggan")));
  }
}

function* fetchCustomerDetailSaga(action: PayloadAction<number>): SagaIterator {
  try {
    const response = yield call(adminService.getCustomer, action.payload);
    yield put(fetchCustomerDetailSuccess(response.data?.data ?? response.data));
  } catch (error) {
    yield put(fetchCustomerDetailFailure(getErrorMessage(error, "Gagal memuat detail pelanggan")));
  }
}

function* toggleCustomerActiveSaga(action: PayloadAction<number>): SagaIterator {
  try {
    const response = yield call(adminService.toggleCustomerActive, action.payload);
    const data = response.data?.data ?? response.data;
    const customer = (data?.user ?? data) as AdminCustomer | undefined;
    yield put(toggleCustomerActiveDone(customer));
    toast.success("Status pelanggan berhasil diperbarui");
  } catch (error) {
    toast.error(getErrorMessage(error, "Gagal mengubah status pelanggan"));
    yield put(toggleCustomerActiveDone(undefined));
  }
}

// Payments
function* fetchPaymentsSaga(action: PayloadAction<AdminFilters | undefined>): SagaIterator {
  try {
    const response = yield call(adminService.getPayments, action.payload);
    const data = response.data?.data ?? response.data;
    yield put(
      fetchPaymentsSuccess({
        items: data.items ?? data.data ?? [],
        meta: data.meta ?? { total: 0, perPage: 10, currentPage: 1, lastPage: 1 },
      })
    );
  } catch (error) {
    yield put(fetchPaymentsFailure(getErrorMessage(error, "Gagal memuat transaksi")));
  }
}

function* refreshPaymentStatusSaga(action: PayloadAction<number>): SagaIterator {
  try {
    yield call(adminService.refreshPaymentStatus, action.payload);
    yield put(refreshPaymentStatusDone());
    toast.success("Status pembayaran berhasil diperbarui");
  } catch (error) {
    toast.error(getErrorMessage(error, "Gagal refresh status pembayaran"));
    yield put(refreshPaymentStatusDone());
  }
}

// Shipments
function* fetchShipmentsSaga(action: PayloadAction<AdminFilters | undefined>): SagaIterator {
  try {
    const response = yield call(adminService.getShipments, action.payload);
    const data = response.data?.data ?? response.data;
    yield put(
      fetchShipmentsSuccess({
        items: data.items ?? data.data ?? [],
        meta: data.meta ?? { total: 0, perPage: 10, currentPage: 1, lastPage: 1 },
      })
    );
  } catch (error) {
    yield put(fetchShipmentsFailure(getErrorMessage(error, "Gagal memuat pengiriman")));
  }
}

function* refreshShipmentTrackingSaga(action: PayloadAction<number>): SagaIterator {
  try {
    yield call(adminService.refreshTracking, action.payload);
    yield put(refreshShipmentTrackingDone());
    toast.success("Tracking berhasil diperbarui");
  } catch (error) {
    toast.error(getErrorMessage(error, "Gagal refresh tracking"));
    yield put(refreshShipmentTrackingDone());
  }
}

function* retryShipmentCreationSaga(action: PayloadAction<number>): SagaIterator {
  try {
    yield call(adminService.retryShipmentCreation, action.payload);
    yield put(retryShipmentCreationDone());
    toast.success("Pengiriman berhasil dibuat ulang");
  } catch (error) {
    toast.error(getErrorMessage(error, "Gagal membuat ulang pengiriman"));
    yield put(retryShipmentCreationDone());
  }
}

// Inventory
function* fetchInventorySaga(action: PayloadAction<AdminFilters | undefined>): SagaIterator {
  try {
    const response = yield call(adminService.getInventory, action.payload);
    const data = response.data?.data ?? response.data;
    yield put(
      fetchInventorySuccess({
        items: data.items ?? data.data ?? [],
        meta: data.meta ?? { total: 0, perPage: 10, currentPage: 1, lastPage: 1 },
      })
    );
  } catch (error) {
    yield put(fetchInventoryFailure(getErrorMessage(error, "Gagal memuat inventory")));
  }
}

function* updateStockSaga(
  action: PayloadAction<{ variantId: number; stock: number }>
): SagaIterator {
  try {
    yield call(adminService.updateStock, action.payload.variantId, action.payload.stock);
    yield put(updateStockDone());
    toast.success("Stok berhasil diperbarui");
  } catch (error) {
    toast.error(getErrorMessage(error, "Gagal memperbarui stok"));
    yield put(updateStockDone());
  }
}

// Invoices
function* fetchInvoicesSaga(action: PayloadAction<AdminFilters | undefined>): SagaIterator {
  try {
    const response = yield call(adminService.getInvoices, action.payload);
    const data = response.data?.data ?? response.data;
    yield put(
      fetchInvoicesSuccess({
        items: data.items ?? data.data ?? [],
        meta: data.meta ?? { total: 0, perPage: 10, currentPage: 1, lastPage: 1 },
      })
    );
  } catch (error) {
    yield put(fetchInvoicesFailure(getErrorMessage(error, "Gagal memuat invoice")));
  }
}

function* fetchInvoiceDetailSaga(action: PayloadAction<number>): SagaIterator {
  try {
    const response = yield call(adminService.getInvoice, action.payload);
    yield put(fetchInvoiceDetailSuccess(response.data?.data ?? response.data));
  } catch (error) {
    yield put(fetchInvoiceDetailFailure(getErrorMessage(error, "Gagal memuat detail invoice")));
  }
}

// Analytics
function* fetchAnalyticsSaga(action: PayloadAction<AnalyticsFilters | undefined>): SagaIterator {
  try {
    const response = yield call(adminService.getAnalytics, action.payload);
    yield put(fetchAnalyticsSuccess(response.data?.data ?? response.data));
  } catch (error) {
    yield put(fetchAnalyticsFailure(getErrorMessage(error, "Gagal memuat data analytics")));
  }
}

export default function* watchAdmin() {
  yield takeLatest(fetchDashboardStats.type, fetchDashboardStatsSaga);
  yield takeLatest(fetchDashboardOrders.type, fetchDashboardOrdersSaga);
  yield takeLatest(fetchOrders.type, fetchOrdersSaga);
  yield takeLatest(fetchOrderDetail.type, fetchOrderDetailSaga);
  yield takeLatest(updateOrderStatus.type, updateOrderStatusSaga);
  yield takeLatest(refreshPayment.type, refreshPaymentSaga);
  yield takeLatest(retryShipment.type, retryShipmentSaga);
  yield takeLatest(updateTracking.type, updateTrackingSaga);
  yield takeLatest(fetchCustomers.type, fetchCustomersSaga);
  yield takeLatest(fetchCustomerDetail.type, fetchCustomerDetailSaga);
  yield takeLatest(toggleCustomerActive.type, toggleCustomerActiveSaga);
  yield takeLatest(fetchPayments.type, fetchPaymentsSaga);
  yield takeLatest(refreshPaymentStatus.type, refreshPaymentStatusSaga);
  yield takeLatest(fetchShipments.type, fetchShipmentsSaga);
  yield takeLatest(refreshShipmentTracking.type, refreshShipmentTrackingSaga);
  yield takeLatest(retryShipmentCreation.type, retryShipmentCreationSaga);
  yield takeLatest(fetchInventory.type, fetchInventorySaga);
  yield takeLatest(updateStock.type, updateStockSaga);
  yield takeLatest(fetchInvoices.type, fetchInvoicesSaga);
  yield takeLatest(fetchInvoiceDetail.type, fetchInvoiceDetailSaga);
  yield takeLatest(fetchAnalytics.type, fetchAnalyticsSaga);
}
