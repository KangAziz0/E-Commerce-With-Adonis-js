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
} from "./productSlice";
import productService from "./productService";
import { SagaIterator } from "redux-saga";

function* fetchProductSaga(): SagaIterator {
  try {
    const response = yield call(productService.getAll);
    yield put(fetchProductsSuccess(response.data));
  } catch (error) {
    yield put(productsFailure("Failed to fetch products"));
  }
}

function* createProductSaga(action: any): SagaIterator {
  try {
    const response = yield call(productService.create, action.payload);
    yield put(createProductSuccess(response.data));
    yield put(fetchProductsRequest());
  } catch (err) {
    yield put(productsFailure("Failed to create product"));
  }
}

function* updateProductSaga(action: any): SagaIterator {
  try {
    const response = yield call(productService.update, action.payload);
    yield put(updateProductSuccess(response.data));
    yield put(fetchProductsRequest());
  } catch (error) {
    yield put(productsFailure("Failed to update product"));
  }
}
function* deleteProductSaga(action: any): SagaIterator {
  try {
    const id = action.payload.id;
    const response = yield call(productService.delete, id);
    yield put(deleteProductSuccess(response.message));
    yield put(fetchProductsRequest());
  } catch (error) {
    yield put(productsFailure("Failed to delete product"));
  }
}

export default function* productSaga() {
  yield takeLatest(fetchProductsRequest.type, fetchProductSaga);
  yield takeLatest(createProductRequest.type, createProductSaga);
  yield takeLatest(updateProductRequest.type, updateProductSaga);
  yield takeLatest(deleteProductRequest.type, deleteProductSaga);
}
