import type { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLatest } from "redux-saga/effects";
import type { SagaIterator } from "redux-saga";
import { toast } from "react-toastify";

import { getErrorMessage } from "@/lib/errorMessage";
import brandService from "./brandService";
import type { SaveBrandPayload } from "./brand.types";
import {
  brandsFailure,
  deleteBrandRequest,
  deleteBrandSuccess,
  fetchBrandsRequest,
  fetchBrandsSuccess,
  saveBrandRequest,
  saveBrandSuccess,
} from "./brandSlice";

function* fetchBrandsSaga(): SagaIterator {
  try {
    const response = yield call(brandService.getAll);
    yield put(fetchBrandsSuccess(response.data?.data ?? []));
  } catch (error) {
    yield put(brandsFailure(getErrorMessage(error, "Gagal memuat brand")));
  }
}

function* saveBrandSaga(action: PayloadAction<SaveBrandPayload>): SagaIterator {
  try {
    const { id, ...payload } = action.payload;
    if (id) {
      yield call(brandService.update, id, payload);
      toast.success("Brand berhasil diupdate");
    } else {
      yield call(brandService.create, payload);
      toast.success("Brand berhasil ditambahkan");
    }
    yield put(saveBrandSuccess());
    yield put(fetchBrandsRequest());
  } catch (error) {
    const message = getErrorMessage(error, "Gagal menyimpan brand");
    toast.error(message);
    yield put(brandsFailure(message));
  }
}

function* deleteBrandSaga(action: PayloadAction<{ id: number }>): SagaIterator {
  try {
    yield call(brandService.delete, action.payload.id);
    yield put(deleteBrandSuccess());
    toast.success("Brand berhasil dihapus");
    yield put(fetchBrandsRequest());
  } catch (error) {
    const message = getErrorMessage(error, "Gagal menghapus brand");
    toast.error(message);
    yield put(brandsFailure(message));
  }
}

export default function* watchBrands() {
  yield takeLatest(fetchBrandsRequest.type, fetchBrandsSaga);
  yield takeLatest(saveBrandRequest.type, saveBrandSaga);
  yield takeLatest(deleteBrandRequest.type, deleteBrandSaga);
}
