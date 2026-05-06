import { PayloadAction } from "@reduxjs/toolkit";
import { OrderDetail } from "./order.type";
import { call, put, takeLatest } from "redux-saga/effects";
import orderService from "./orderService";
import {
  checkoutFailure,
  fetchOrderRequest,
  fetchOrderSuccess,
} from "./orderSlice";

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
  yield takeLatest(fetchOrderRequest.type, handleFetchOrder);
}
