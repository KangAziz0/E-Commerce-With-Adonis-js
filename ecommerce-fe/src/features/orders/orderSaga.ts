import type { PayloadAction } from "@reduxjs/toolkit";
import type { SagaIterator } from "redux-saga";
import { all, call, put, takeLatest } from "redux-saga/effects";

import { getErrorMessage } from "@/lib/errorMessage";
import orderService from "./orderService";
import type { OrderDetail, OrderListItem } from "./order.types";
import {
  fetchOrderFailure,
  fetchOrderRequest,
  fetchOrderSuccess,
  fetchMyOrdersRequest,
  fetchMyOrdersSuccess,
  fetchMyOrdersFailure,
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

function* handleFetchMyOrders(): SagaIterator {
  try {
    const orders: OrderListItem[] = yield call(orderService.getMyOrders);
    yield put(fetchMyOrdersSuccess(orders));
  } catch (error) {
    yield put(fetchMyOrdersFailure(getErrorMessage(error, "Gagal memuat daftar pesanan")));
  }
}

export default function* watchOrders() {
  yield all([
    takeLatest(fetchOrderRequest.type, handleFetchOrder),
    takeLatest(fetchMyOrdersRequest.type, handleFetchMyOrders),
  ]);
}
