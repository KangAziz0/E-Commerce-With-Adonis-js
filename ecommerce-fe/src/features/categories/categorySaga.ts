import { call, put, takeLatest } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import categoriesService from "./categoryService";
import {
  categoriesFailure,
  deleteCategoryRequest,
  deleteCategorySuccess,
  fetchCategoriesRequest,
  fetchCategoriesSuccess,
  saveCategoryRequest,
  saveCategorySuccess,
} from "./categorySlice";
import { PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { SaveCategoryPayload } from "./category.types";

function* fetchCategorySaga(): SagaIterator {
  try {
    const response = yield call(categoriesService.getAll);
    yield put(fetchCategoriesSuccess(response.data.data));
  } catch (error) {
    yield put(categoriesFailure("Failed to fetch products"));
  }
}

function* saveCategorySaga(
  action: PayloadAction<SaveCategoryPayload>,
): SagaIterator {
  try {
    const { id, ...payload } = action.payload;
    if (id) {
      yield call(categoriesService.update, id, payload);
      toast.success("Category berhasil diupdate ✨");
    } else {
      yield call(categoriesService.create, payload);
      toast.success("Category berhasil ditambahkan 🎉");
    }

    yield put(saveCategorySuccess());
    yield put(fetchCategoriesRequest());
  } catch (error: any) {
    toast.error(error?.response?.data?.message ?? "Gagal menyimpan category");
    yield put(categoriesFailure("Failed to save category"));
  }
}

function* deleteCategorySaga(
  action: PayloadAction<{ id: number }>,
): SagaIterator {
  try {
    yield call(categoriesService.delete, action.payload.id);

    yield put(deleteCategorySuccess());

    toast.success("Category berhasil dihapus 🗑️");

    yield put(fetchCategoriesRequest());
  } catch (error: any) {
    toast.error(error?.response?.data?.message ?? "Gagal menghapus category");
    yield put(categoriesFailure("Failed to delete product"));
  }
}

export default function* productSaga() {
  yield takeLatest(fetchCategoriesRequest.type, fetchCategorySaga);
  yield takeLatest(saveCategoryRequest.type, saveCategorySaga);
  yield takeLatest(deleteCategoryRequest.type, deleteCategorySaga);
}
