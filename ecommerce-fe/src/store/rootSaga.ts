import { all } from "redux-saga/effects";
import watchProducts from "../features/products/productSaga";
import watchAuth from "../features/auth/authSaga";
import watchCategories from "../features/categories/categorySaga";
export default function* rootSaga() {
  yield all([watchProducts(), watchAuth(), watchCategories()]);
}
