import type { PayloadAction } from "@reduxjs/toolkit";
import { call, delay, put, takeLatest } from "redux-saga/effects";
import type { SagaIterator } from "redux-saga";
import { toast } from "react-toastify";

import { getErrorMessage } from "@/lib/errorMessage";
import voucherService from "./voucherService";
import type { SaveVoucherPayload } from "./voucher.types";
import {
  deleteVoucherRequest,
  deleteVoucherSuccess,
  fetchVouchersRequest,
  fetchVouchersSuccess,
  saveVoucherRequest,
  saveVoucherSuccess,
  vouchersFailure,
} from "./voucherSlice";

function* fetchVouchersSaga(): SagaIterator {
  try {
    const response = yield call(voucherService.getAll);
    yield put(fetchVouchersSuccess(response.data?.data ?? []));
  } catch (error) {
    yield put(vouchersFailure(getErrorMessage(error, "Gagal memuat voucher")));
  }
}

function* saveVoucherSaga(action: PayloadAction<SaveVoucherPayload>): SagaIterator {
  try {
    const { id, ...payload } = action.payload;
    if (id) {
      yield call(voucherService.update, id, payload);
      toast.success("Voucher berhasil diupdate");
    } else {
      yield call(voucherService.create, payload);
      toast.success("Voucher berhasil ditambahkan");
    }

    yield put(saveVoucherSuccess());
    yield delay(300);
    yield put(fetchVouchersRequest());
  } catch (error) {
    const message = getErrorMessage(error, "Gagal menyimpan voucher");
    toast.error(message);
    yield put(vouchersFailure(message));
  }
}

function* deleteVoucherSaga(action: PayloadAction<{ id: number }>): SagaIterator {
  try {
    yield call(voucherService.delete, action.payload.id);
    yield put(deleteVoucherSuccess());
    toast.success("Voucher berhasil dihapus");
    yield delay(300);
    yield put(fetchVouchersRequest());
  } catch (error) {
    const message = getErrorMessage(error, "Gagal menghapus voucher");
    toast.error(message);
    yield put(vouchersFailure(message));
  }
}

export default function* watchVouchers() {
  yield takeLatest(fetchVouchersRequest.type, fetchVouchersSaga);
  yield takeLatest(saveVoucherRequest.type, saveVoucherSaga);
  yield takeLatest(deleteVoucherRequest.type, deleteVoucherSaga);
}
