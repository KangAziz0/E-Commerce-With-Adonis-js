import { all } from "redux-saga/effects";
import watchProducts from "../features/products/productsSaga";

export default function* rootSaga() {
  yield all([watchProducts()]);
}
