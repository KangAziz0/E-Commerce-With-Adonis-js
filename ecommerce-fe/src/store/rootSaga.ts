import { all } from "redux-saga/effects";
import watchProducts from "../features/products/productsSaga";
import watchAuth from "../features/auth/authSaga";
export default function* rootSaga() {
  yield all([watchProducts(), watchAuth()]);
}
