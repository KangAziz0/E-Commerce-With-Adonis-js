import type { PayloadAction } from "@reduxjs/toolkit";
import type { SagaIterator } from "redux-saga";
import {
  call,
  cancel,
  delay,
  fork,
  put,
  take,
  takeLatest,
} from "redux-saga/effects";
import type { Task } from "redux-saga";

import { CHECKOUT_STORAGE_KEYS, PAYMENT_POLL_INTERVAL } from "@/constants/checkout";
import { getErrorMessage } from "@/lib/errorMessage";
import checkoutService from "./checkoutService";
import type {
  CourierRate,
  CreateOrderPayload,
  CreateOrderResponse,
  CreatePaymentPayload,
  GetRatesParams,
  PaymentResponse,
} from "./checkout.types";
import {
  createOrderFailure,
  createOrderRequest,
  createOrderSuccess,
  createPaymentFailure,
  createPaymentRequest,
  createPaymentSuccess,
  getRatesError,
  getRatesRequest,
  getRatesSuccess,
  paymentPollingError,
  paymentStatusUpdated,
  startPaymentPolling,
  stopPaymentPolling,
} from "./checkoutSlice";

function* handleFetchRates(
  action: PayloadAction<GetRatesParams>
): SagaIterator {
  try {
    const response: { data: CourierRate[] } = yield call(
      checkoutService.getRates,
      action.payload
    );
    yield put(getRatesSuccess(response.data));
  } catch (error) {
    yield put(getRatesError(getErrorMessage(error, "Gagal mengambil tarif")));
  }
}

function* handleCreateOrder(
  action: PayloadAction<CreateOrderPayload>
): SagaIterator {
  try {
    const order: CreateOrderResponse = yield call(
      checkoutService.createOrder,
      action.payload
    );
    yield put(createOrderSuccess(order));
    localStorage.setItem(
      CHECKOUT_STORAGE_KEYS.pendingExternalId,
      order.externalId
    );
  } catch (error) {
    yield put(
      createOrderFailure(getErrorMessage(error, "Gagal membuat pesanan"))
    );
  }
}

function* handleCreatePayment(
  action: PayloadAction<CreatePaymentPayload>
): SagaIterator {
  try {
    const payment: PaymentResponse = yield call(
      checkoutService.createPayment,
      action.payload
    );
    yield put(createPaymentSuccess(payment));
    localStorage.setItem(
      CHECKOUT_STORAGE_KEYS.pendingPaymentId,
      String(payment.id)
    );
    yield put(startPaymentPolling(payment.id));
  } catch (error) {
    yield put(
      createPaymentFailure(getErrorMessage(error, "Gagal membuat pembayaran"))
    );
  }
}

function* pollPaymentStatus(action: PayloadAction<number>): SagaIterator {
  const paymentId = action.payload;
  try {
    while (true) {
      yield delay(PAYMENT_POLL_INTERVAL);
      const response: PaymentResponse = yield call(
        checkoutService.getPaymentStatus,
        paymentId
      );
      yield put(paymentStatusUpdated(response));
      if (
        response.status === "PAID" ||
        response.status === "EXPIRED" ||
        response.status === "FAILED"
      ) {
        localStorage.removeItem(CHECKOUT_STORAGE_KEYS.pendingExternalId);
        localStorage.removeItem(CHECKOUT_STORAGE_KEYS.pendingPaymentId);
        break;
      }
    }
  } catch (error) {
    yield put(
      paymentPollingError(
        getErrorMessage(error, "Gagal memeriksa status pembayaran")
      )
    );
  }
}

function* watchPaymentPolling(): SagaIterator {
  while (true) {
    const action: PayloadAction<number> = yield take(startPaymentPolling.type);
    const task: Task = yield fork(pollPaymentStatus, action);
    yield take([stopPaymentPolling.type, "checkout/resetCheckout"]);
    yield cancel(task);
  }
}

export default function* watchCheckout() {
  yield takeLatest(getRatesRequest.type, handleFetchRates);
  yield takeLatest(createOrderRequest.type, handleCreateOrder);
  yield takeLatest(createPaymentRequest.type, handleCreatePayment);
  yield fork(watchPaymentPolling);
}
