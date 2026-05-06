import { RootState } from "@/store/store";
import { SagaIterator } from "redux-saga";
import { select, takeLatest, put, call, all } from "redux-saga/effects";
import {
  addToCart,
  clearCart,
  decreaseQty,
  removeFromCart,
  setCart,
} from "./cartSlice";

const STORAGE_KEY = "cart";

function* persistCart(): SagaIterator {
  const cartItems = yield select((state: RootState) => state.cart.items);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
}

function* loadCartFromStorage(): SagaIterator {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return;

  const items = JSON.parse(saved);
  yield put(setCart(items));
}

export default function* cartSaga() {
  yield call(loadCartFromStorage);
  yield all([
    takeLatest(addToCart.type, persistCart),
    takeLatest(decreaseQty.type, persistCart),
    takeLatest(removeFromCart.type, persistCart),
    takeLatest(clearCart.type, persistCart),
    takeLatest(setCart.type, persistCart),
  ]);
}
