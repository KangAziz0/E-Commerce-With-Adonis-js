import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLatest } from "redux-saga/effects";
import checkoutService from "./checkoutService";
import { GetRatesParams } from "./checkout.type";
import { CourierRate } from "@/components/common/CourierCard";
import {
  getRatesError,
  getRatesRequest,
  getRatesSuccess,
} from "./checkoutSlice";

function* handleFetchRates(action: PayloadAction<GetRatesParams>) {
  try {
    const response: { data: CourierRate[] } = yield call(
      checkoutService.getRates,
      action.payload,
    );
    yield put(getRatesSuccess(response.data));
  } catch (error: any) {
    const message =
      error?.response?.data?.errors?.[0]?.message ??
      error?.response?.data?.message ??
      "Gagal mengambil tarif";
    yield put(getRatesError(message));
  }
}

export default function* checkoutSaga() {
  yield takeLatest(getRatesRequest.type, handleFetchRates);
}
