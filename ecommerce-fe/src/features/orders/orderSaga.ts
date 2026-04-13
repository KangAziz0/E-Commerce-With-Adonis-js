import { PayloadAction } from "@reduxjs/toolkit";
import {
  CreateInvoicePayload,
  InvoiceResponse,
  OrderDetail,
} from "./order.type";
import { call, put, takeLatest } from "redux-saga/effects";
import orderService from "./orderService";
import {
  checkoutFailure,
  createInvoiceRequest,
  createInvoiceSuccess,
  fetchOrderRequest,
  fetchOrderSuccess,
} from "./orderSlice";

function* handleCreateInvoice(action: PayloadAction<CreateInvoicePayload>) {
  try {
    const invoice: InvoiceResponse = yield call(
      orderService.createInvoice,
      action.payload,
    );
    yield put(createInvoiceSuccess(invoice));
    localStorage.setItem("pending_external_id", invoice.externalId);

    // Redirect ke halaman pembayaran Xendit
    window.location.href = invoice.invoiceUrl;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout failed";
    yield put(checkoutFailure(message));
  }
}

function* handleFetchOrder(action: PayloadAction<string>) {
  try {
    const order: OrderDetail = yield call(
      orderService.getOrderByExternalId,
      action.payload,
    );
    yield put(fetchOrderSuccess(order));
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch order";
    yield put(checkoutFailure(message));
  }
}

export default function* orderSaga() {
  yield takeLatest(createInvoiceRequest.type, handleCreateInvoice);
  yield takeLatest(fetchOrderRequest.type, handleFetchOrder);
}
