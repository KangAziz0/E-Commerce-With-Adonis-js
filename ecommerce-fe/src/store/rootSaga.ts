import { all } from "redux-saga/effects";
import watchProducts from "@/features/products/productSaga";
import watchAuth from "@/features/auth/authSaga";
import watchCategories from "@/features/categories/categorySaga";
import watchCart from "@/features/cart/cartSaga";
export default function* rootSaga() {
  yield all([watchProducts(), watchAuth(), watchCategories(), watchCart()]);
}
