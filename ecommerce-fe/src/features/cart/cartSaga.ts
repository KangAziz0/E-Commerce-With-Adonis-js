import type { SagaIterator } from "redux-saga";
import { all, call, put, select, takeLatest } from "redux-saga/effects";

import { CART_STORAGE_KEY } from "@/constants/cart";
import type { RootState } from "@/store/store";
import {
  addToCart,
  clearCart,
  decreaseQty,
  removeFromCart,
  setCart,
} from "./cartSlice";
import type { CartItem } from "./cart.types";

function* persistCart(): SagaIterator {
  const cartItems: CartItem[] = yield select(
    (state: RootState) => state.cart.items,
  );
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
}

function* loadCartFromStorage(): SagaIterator {
  const saved = localStorage.getItem(CART_STORAGE_KEY);
  if (!saved) return;
  try {
    const items = JSON.parse(saved) as CartItem[];
    yield put(setCart(items));
  } catch {
    // Corrupt payload — drop it silently to avoid crashing on startup.
    localStorage.removeItem(CART_STORAGE_KEY);
  }
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
