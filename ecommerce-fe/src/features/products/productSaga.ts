import { call, put, takeLatest } from "redux-saga/effects";
import {
  createProductRequest,
  createProductSuccess,
  fetchProductsRequest,
  fetchProductsSuccess,
  productsFailure,
  updateProductSuccess,
  deleteProductSuccess,
  updateProductRequest,
  deleteProductRequest,
  fetchDetailProductSuccess,
  fetchDetailProductFailure,
  fetchDetailProductRequest,
} from "./productSlice";
import productService from "./productService";
import { SagaIterator } from "redux-saga";
import { mapProduct } from "@/mappers/productMapper";
import { Product } from "@/types/ui/product";

function* fetchProductSaga(action: ReturnType<typeof fetchProductsRequest>): SagaIterator {
  try {
    const params = action.payload || {};
    const response = yield call(productService.getAll, params);
    const payload = response.data.data;
    const products: Product[] = payload.items.map(mapProduct);
    yield put(fetchProductsSuccess({ items: products, meta: payload.meta, append: params.append }));
  } catch (error) {
    yield put(productsFailure("Failed to fetch products"));
  }
}

function* fetchDetailProductSaga(action: any): SagaIterator {
  try {
    const id = action.payload;
    const response = yield call(productService.getDetail, id);
    const product: Product = mapProduct(response.data.data);
    yield put(fetchDetailProductSuccess(product));
  } catch (error) {
    yield put(fetchDetailProductFailure(error));
  }
}

function* createProductSaga(action: any): SagaIterator { try { const response = yield call(productService.create, action.payload); yield put(createProductSuccess(response.data)); yield put(fetchProductsRequest()); } catch { yield put(productsFailure("Failed to create product")); }}
function* updateProductSaga(action: any): SagaIterator { try { const response = yield call(productService.update, action.payload); yield put(updateProductSuccess(response.data)); yield put(fetchProductsRequest()); } catch { yield put(productsFailure("Failed to update product")); }}
function* deleteProductSaga(action: any): SagaIterator { try { const id = action.payload.id; const response = yield call(productService.delete, id); yield put(deleteProductSuccess(response.message)); yield put(fetchProductsRequest()); } catch { yield put(productsFailure("Failed to delete product")); }}

export default function* productSaga() {
  yield takeLatest(fetchProductsRequest.type, fetchProductSaga);
  yield takeLatest(createProductRequest.type, createProductSaga);
  yield takeLatest(updateProductRequest.type, updateProductSaga);
  yield takeLatest(deleteProductRequest.type, deleteProductSaga);
  yield takeLatest(fetchDetailProductRequest.type, fetchDetailProductSaga);
}
