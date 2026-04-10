import { RootState } from "@/store/store";
import { SagaIterator } from "redux-saga";
import { select, takeLatest, put, call } from "redux-saga/effects";
import { addToCart, setCart } from "./cardSlice";

function* saveCartToStorage(): SagaIterator {
  const cart = yield select((state: RootState) => state.cart.items);
  localStorage.setItem("cart", JSON.stringify(cart));
}

function* loadCartFromStorage(): SagaIterator {
  const saved = localStorage.getItem("cart");
  if (saved) {
    const items = JSON.parse(saved);
    yield put(setCart(items));
  }
}

export default function* cartSaga() {
  yield call(loadCartFromStorage);
  yield takeLatest(addToCart.type, saveCartToStorage);
}
