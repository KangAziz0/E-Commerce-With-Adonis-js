import type { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLatest } from "redux-saga/effects";
import type { SagaIterator } from "redux-saga";
import { toast } from "react-toastify";

import { getErrorMessage } from "@/lib/errorMessage";
import categoriesService from "./categoryService";
import type { SaveCategoryPayload } from "./category.types";
import {
  categoriesFailure,
  deleteCategoryRequest,
  deleteCategorySuccess,
  fetchCategoriesRequest,
  fetchCategoriesSuccess,
  saveCategoryRequest,
  saveCategorySuccess,
} from "./categorySlice";

function* fetchCategoriesSaga(): SagaIterator {
  try {
    const response = yield call(categoriesService.getAll);
    yield put(fetchCategoriesSuccess(response.data?.data ?? []));
  } catch (error) {
    yield put(categoriesFailure(getErrorMessage(error, "Gagal memuat kategori")));
  }
}

function* saveCategorySaga(
  action: PayloadAction<SaveCategoryPayload>,
): SagaIterator {
  try {
    const { id, ...payload } = action.payload;
    const categoryId = Number(id);
    const shouldUpdate = Number.isFinite(categoryId) && categoryId > 0;

    if (shouldUpdate) {
      yield call(categoriesService.update, categoryId, payload);
      toast.success("Kategori berhasil diupdate");
    } else {
      yield call(categoriesService.create, payload);
      toast.success("Kategori berhasil ditambahkan");
    }
    yield put(saveCategorySuccess());
    yield put(fetchCategoriesRequest());
  } catch (error) {
    const message = getErrorMessage(error, "Gagal menyimpan kategori");
    toast.error(message);
    yield put(categoriesFailure(message));
  }
}

function* deleteCategorySaga(
  action: PayloadAction<{ id: number }>,
): SagaIterator {
  try {
    yield call(categoriesService.delete, action.payload.id);
    yield put(deleteCategorySuccess());
    toast.success("Kategori berhasil dihapus");
    yield put(fetchCategoriesRequest());
  } catch (error) {
    const message = getErrorMessage(error, "Gagal menghapus kategori");
    toast.error(message);
    yield put(categoriesFailure(message));
  }
}

export default function* watchCategories() {
  yield takeLatest(fetchCategoriesRequest.type, fetchCategoriesSaga);
  yield takeLatest(saveCategoryRequest.type, saveCategorySaga);
  yield takeLatest(deleteCategoryRequest.type, deleteCategorySaga);
}
