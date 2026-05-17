import type { PayloadAction } from "@reduxjs/toolkit";
import type { SagaIterator } from "redux-saga";
import { call, put, takeLatest } from "redux-saga/effects";

import { CHECKOUT_STORAGE_KEYS } from "@/constants/checkout";
import { getErrorMessage } from "@/lib/errorMessage";
import checkoutService from "./checkoutService";
import type {
  CourierRate,
  CreateInvoicePayload,
  GetRatesParams,
  InvoiceResponse,
} from "./checkout.types";
import {
  createInvoiceFailure,
  createInvoiceRequest,
  createInvoiceSuccess,
  getRatesError,
  getRatesRequest,
  getRatesSuccess,
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
    // Hand over to the payment gateway.
    window.location.href = invoice.invoiceUrl;
  } catch (error) {
    yield put(createInvoiceFailure(getErrorMessage(error, "Checkout gagal")));
  }
}

export default function* watchCheckout() {
  yield takeLatest(getRatesRequest.type, handleFetchRates);
  yield takeLatest(createInvoiceRequest.type, handleCreateInvoice);
}
