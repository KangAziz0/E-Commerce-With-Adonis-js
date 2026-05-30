import type { SagaIterator } from "redux-saga";
import { call, put, select, takeLatest } from "redux-saga/effects";

import { getErrorMessage } from "@/lib/errorMessage";
import type { RootState } from "@/store/store";
import { fetchMeSuccess, logout } from "@/features/auth/authSlice";
import cartService from "./cartService";
import type { CartItem } from "./cart.types";
import {
  addToCartFailure,
  addToCartRequest,
  addToCartSuccess,
  clearCartRequest,
  clearCartSuccess,
  decreaseQtyRequest,
  fetchCartFailure,
  fetchCartRequest,
  fetchCartSuccess,
  removeFromCartRequest,
} from "./cartSlice";

function* fetchCartSaga(): SagaIterator {
  try {
    const items: CartItem[] = yield call(cartService.getAll);
    yield put(fetchCartSuccess(items));
  } catch (error) {
    yield put(fetchCartFailure(getErrorMessage(error, "Gagal memuat keranjang")));
  }
}

function* addToCartSaga(action: ReturnType<typeof addToCartRequest>): SagaIterator {
  try {
    const payload = action.payload;
    const items: CartItem[] = yield call(cartService.add, {
      productId: payload.productId,
      variantId: payload.variantId,
      qty: payload.quantity,
      price: payload.price,
      size: payload.size,
      color: payload.color,
    });
    yield put(addToCartSuccess(items));
  } catch (error) {
    yield put(addToCartFailure(getErrorMessage(error, "Gagal menambahkan ke keranjang")));
  }
}

function* decreaseQtySaga(action: ReturnType<typeof decreaseQtyRequest>): SagaIterator {
  try {
    const { id } = action.payload;
    const items: CartItem[] = yield select((state: RootState) => state.cart.items);
    const item = items.find((i) => i.id === id);

    if (!item) return;

    if (item.quantity <= 1) {
      // Remove item
      const updatedItems: CartItem[] = yield call(cartService.remove, id);
      yield put(fetchCartSuccess(updatedItems));
    } else {
      // Decrease qty
      const updatedItems: CartItem[] = yield call(cartService.update, {
        id,
        qty: item.quantity - 1,
      });
      yield put(fetchCartSuccess(updatedItems));
    }
  } catch (error) {
    yield put(fetchCartFailure(getErrorMessage(error, "Gagal mengubah keranjang")));
  }
}

function* removeFromCartSaga(action: ReturnType<typeof removeFromCartRequest>): SagaIterator {
  try {
    const { id } = action.payload;
    const updatedItems: CartItem[] = yield call(cartService.remove, id);
    yield put(fetchCartSuccess(updatedItems));
  } catch (error) {
    yield put(fetchCartFailure(getErrorMessage(error, "Gagal menghapus item")));
  }
}

function* clearCartSaga(): SagaIterator {
  try {
    yield call(cartService.clear);
    yield put(clearCartSuccess());
  } catch (error) {
    yield put(fetchCartFailure(getErrorMessage(error, "Gagal mengosongkan keranjang")));
  }
}

/**
 * When user is authenticated (fetchMeSuccess), auto-fetch the cart from DB.
 */
function* onAuthenticatedSaga(): SagaIterator {
  yield put(fetchCartRequest());
}

/**
 * When user logs out, clear cart state locally.
 */
function* onLogoutSaga(): SagaIterator {
  yield put(clearCartSuccess());
}

export default function* cartSaga() {
  yield takeLatest(fetchCartRequest.type, fetchCartSaga);
  yield takeLatest(addToCartRequest.type, addToCartSaga);
  yield takeLatest(decreaseQtyRequest.type, decreaseQtySaga);
  yield takeLatest(removeFromCartRequest.type, removeFromCartSaga);
  yield takeLatest(clearCartRequest.type, clearCartSaga);
  yield takeLatest(fetchMeSuccess.type, onAuthenticatedSaga);
  yield takeLatest(logout.type, onLogoutSaga);
}
