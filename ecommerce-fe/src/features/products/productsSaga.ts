import { call, put, takeLatest } from "redux-saga/effects";
import {
  fetchProductsRequest,
  fetchProductsSuccess,
  fetchProductsFailure,
  addProductSuccess,
} from "./productsSlice";
import api from "../../api";

function* fetchProducts() {
  try {
    const response = yield call(api.get, "/products");
    yield put(fetchProductsSuccess(response.data));
  } catch (err: any) {
    yield put(
      fetchProductsFailure(
        err.response?.data?.message || "Failed to fetch products"
      )
    );
  }
}

function* addProduct(action: any) {
  try {
    const token = localStorage.getItem("token");
    const response = yield call(api.post, "/products", action.payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    yield put(addProductSuccess(response.data));
  } catch (err: any) {
    console.error(err);
  }
}

export default function* watchProducts() {
  yield takeLatest(fetchProductsRequest.type, fetchProducts);
  yield takeLatest(addProductSuccess.type, addProduct);
}
