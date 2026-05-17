import type { PayloadAction } from "@reduxjs/toolkit";
import type { SagaIterator } from "redux-saga";
import { call, put, takeLatest } from "redux-saga/effects";

import { getErrorMessage } from "@/lib/errorMessage";
import orderService from "./orderService";
import type { OrderDetail } from "./order.types";
import {
  fetchOrderFailure,
  fetchOrderRequest,
  fetchOrderSuccess,
} from "./orderSlice";

function* handleFetchOrder(action: PayloadAction<string>): SagaIterator {
  try {
    const order: OrderDetail = yield call(
      orderService.getOrderByExternalId,
      action.payload,
    );
    yield put(fetchOrderSuccess(order));
  } catch (error) {
    yield put(fetchOrderFailure(getErrorMessage(error, "Gagal memuat pesanan")));
  }
}

export default function* watchOrders() {
  yield takeLatest(fetchOrderRequest.type, handleFetchOrder);
}
