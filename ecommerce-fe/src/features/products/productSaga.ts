import type { PayloadAction } from "@reduxjs/toolkit";
import type { SagaIterator } from "redux-saga";
import { call, put, takeLatest } from "redux-saga/effects";

import { mapProduct } from "@/mappers/productMapper";
import { getErrorMessage } from "@/lib/errorMessage";
import type { Product } from "@/types/ui/product";
import type { ProductAPI } from "@/types/api/product";
import productService from "./productService";
import {
  createProductRequest,
  createProductSuccess,
  deleteProductRequest,
  deleteProductSuccess,
  fetchDetailProductFailure,
  fetchDetailProductRequest,
  fetchDetailProductSuccess,
  fetchProductsRequest,
  fetchProductsSuccess,
  productsFailure,
  updateProductRequest,
  updateProductSuccess,
} from "./productSlice";

function* fetchProductsSaga(
  action: ReturnType<typeof fetchProductsRequest>,
): SagaIterator {
  try {
    const params = action.payload || {};
    const response = yield call(productService.getAll, params);
    const payload = response.data?.data;
    const items: Product[] = (payload?.items ?? []).map(mapProduct);
    console.log("product saga", items);

    yield put(
      fetchProductsSuccess({
        items,
        meta: payload.meta,
        append: params.append,
      }),
    );
  } catch (error) {
    yield put(productsFailure(getErrorMessage(error, "Gagal memuat produk")));
  }
}

function* fetchDetailProductSaga(action: PayloadAction<number>): SagaIterator {
  try {
    const response = yield call(productService.getDetail, action.payload);
    const product: Product = mapProduct(response.data?.data as ProductAPI);

    yield put(fetchDetailProductSuccess(product));
  } catch (error) {
    yield put(
      fetchDetailProductFailure(
        getErrorMessage(error, "Gagal memuat detail produk"),
      ),
    );
  }
}

function* createProductSaga(action: PayloadAction<Product>): SagaIterator {
  try {
    const response = yield call(productService.create, action.payload);
    yield put(createProductSuccess(response.data));
    yield put(fetchProductsRequest());
  } catch (error) {
    yield put(productsFailure(getErrorMessage(error, "Gagal membuat produk")));
  }
}

function* updateProductSaga(action: PayloadAction<Product>): SagaIterator {
  try {
    yield call(productService.update, action.payload);
    yield put(updateProductSuccess());
    yield put(fetchProductsRequest());
  } catch (error) {
    yield put(
      productsFailure(getErrorMessage(error, "Gagal memperbarui produk")),
    );
  }
}

function* deleteProductSaga(
  action: PayloadAction<{ id: number }>,
): SagaIterator {
  try {
    yield call(productService.delete, action.payload.id);
    yield put(deleteProductSuccess());
    yield put(fetchProductsRequest());
  } catch (error) {
    yield put(
      productsFailure(getErrorMessage(error, "Gagal menghapus produk")),
    );
  }
}

export default function* watchProducts() {
  yield takeLatest(fetchProductsRequest.type, fetchProductsSaga);
  yield takeLatest(fetchDetailProductRequest.type, fetchDetailProductSaga);
  yield takeLatest(createProductRequest.type, createProductSaga);
  yield takeLatest(updateProductRequest.type, updateProductSaga);
  yield takeLatest(deleteProductRequest.type, deleteProductSaga);
}
