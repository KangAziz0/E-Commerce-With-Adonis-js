import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLatest } from "redux-saga/effects";
import checkoutService from "./checkoutService";
import {
  CreateInvoicePayload,
  GetRatesParams,
  InvoiceResponse,
} from "./checkout.type";
import { CourierRate } from "@/components/common/CourierCard";
import {
  createInvoiceFailure,
  createInvoiceRequest,
  createInvoiceSuccess,
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

function* handleCreateInvoice(action: PayloadAction<CreateInvoicePayload>) {
  try {
    const invoice: InvoiceResponse = yield call(
      checkoutService.createInvoice,
      action.payload,
    );
    yield put(createInvoiceSuccess(invoice));
    localStorage.setItem("pending_external_id", invoice.externalId);

    // Redirect ke halaman pembayaran Xendit
    window.location.href = invoice.invoiceUrl;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout failed";
    yield put(createInvoiceFailure(message));
  }
}

export default function* checkoutSaga() {
  yield takeLatest(getRatesRequest.type, handleFetchRates);
  yield takeLatest(createInvoiceRequest.type, handleCreateInvoice);
}
