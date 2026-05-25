import type { PayloadAction } from "@reduxjs/toolkit";
import type { SagaIterator } from "redux-saga";
import { call, cancel, delay, fork, put, take, takeLatest } from "redux-saga/effects";
import type { Task } from "redux-saga";

import { CHECKOUT_STORAGE_KEYS, PAYMENT_POLL_INTERVAL } from "@/constants/checkout";
import { getErrorMessage } from "@/lib/errorMessage";
import checkoutService from "./checkoutService";
import type {
  CourierRate,
  CreateInvoicePayload,
  GetRatesParams,
  InvoiceResponse,
  PaymentStatusResponse,
} from "./checkout.types";
import {
  createInvoiceFailure,
  createInvoiceRequest,
  createInvoiceSuccess,
  getRatesError,
  getRatesRequest,
  getRatesSuccess,
  paymentPollingError,
  paymentStatusUpdated,
  startPaymentPolling,
  stopPaymentPolling,
} from "./checkoutSlice";

function* handleFetchRates(
  action: PayloadAction<GetRatesParams>,
): SagaIterator {
  try {
    const response: { data: CourierRate[] } = yield call(
      checkoutService.getRates,
      action.payload,
    );
    yield put(getRatesSuccess(response.data));
  } catch (error) {
    yield put(getRatesError(getErrorMessage(error, "Gagal mengambil tarif")));
  }
}

function* handleCreateInvoice(
  action: PayloadAction<CreateInvoicePayload>,
): SagaIterator {
  try {
    const invoice: InvoiceResponse = yield call(
      checkoutService.createInvoice,
      action.payload,
    );
    yield put(createInvoiceSuccess(invoice));
    localStorage.setItem(
      CHECKOUT_STORAGE_KEYS.pendingExternalId,
      invoice.externalId,
    );
    // Open the payment gateway in a new tab instead of redirecting.
    window.open(invoice.invoiceUrl, "_blank");
    // Start polling for payment status.
    yield put(startPaymentPolling(invoice.externalId));
  } catch (error) {
    yield put(createInvoiceFailure(getErrorMessage(error, "Checkout gagal")));
  }
}

function* pollPaymentStatus(
  action: PayloadAction<string>,
): SagaIterator {
  const orderId = action.payload;
  try {
    while (true) {
      yield delay(PAYMENT_POLL_INTERVAL);
      const response: PaymentStatusResponse = yield call(
        checkoutService.getPaymentStatus,
        orderId,
      );
      yield put(paymentStatusUpdated(response.status));
      if (
        response.status === "PAID" ||
        response.status === "EXPIRED" ||
        response.status === "FAILED"
      ) {
        break;
      }
    }
  } catch (error) {
    yield put(
      paymentPollingError(
        getErrorMessage(error, "Gagal memeriksa status pembayaran"),
      ),
    );
  }
}

function* watchPaymentPolling(): SagaIterator {
  while (true) {
    const action: PayloadAction<string> = yield take(startPaymentPolling.type);
    const task: Task = yield fork(pollPaymentStatus, action);
    yield take([stopPaymentPolling.type, "checkout/resetCheckout"]);
    yield cancel(task);
  }
}

export default function* watchCheckout() {
  yield takeLatest(getRatesRequest.type, handleFetchRates);
  yield takeLatest(createInvoiceRequest.type, handleCreateInvoice);
  yield fork(watchPaymentPolling);
}
