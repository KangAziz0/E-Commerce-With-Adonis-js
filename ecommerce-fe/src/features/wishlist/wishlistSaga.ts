import type { SagaIterator } from "redux-saga";
import { call, put, select, takeLatest } from "redux-saga/effects";

import { mapProduct } from "@/mappers/productMapper";
import type { ProductAPI } from "@/types/api/product";
import { getErrorMessage } from "@/lib/errorMessage";
import type { RootState } from "@/store/store";
import wishlistService from "./wishlistService";
import type { WishlistItem } from "./wishlist.types";
import {
  fetchWishlistRequest,
  fetchWishlistSuccess,
  toggleWishlistRequest,
  wishlistFailure,
} from "./wishlistSlice";

interface WishlistRowApi {
  id: number;
  product: ProductAPI;
}

const toWishlistItems = (rows: WishlistRowApi[]): WishlistItem[] =>
  rows.map((row) => ({ wishlistId: row.id, ...mapProduct(row.product) }));

function* fetchWishlistSaga(): SagaIterator {
  try {
    const rows: WishlistRowApi[] = yield call(wishlistService.getAll);
    yield put(fetchWishlistSuccess(toWishlistItems(rows)));
  } catch (error) {
    yield put(wishlistFailure(getErrorMessage(error, "Gagal memuat wishlist")));
  }
}

function* toggleWishlistSaga(
  action: ReturnType<typeof toggleWishlistRequest>,
): SagaIterator {
  try {
    const { productId } = action.payload;
    const items: WishlistItem[] = yield select(
      (state: RootState) => state.wishlist.items,
    );
    const exists = items.some((item) => item.id === productId);

    if (exists) {
      yield call(wishlistService.remove, productId);
    } else {
      yield call(wishlistService.add, productId);
    }

    const rows: WishlistRowApi[] = yield call(wishlistService.getAll);
    yield put(fetchWishlistSuccess(toWishlistItems(rows)));
  } catch (error) {
    yield put(wishlistFailure(getErrorMessage(error, "Gagal mengubah wishlist")));
  }
}

export default function* watchWishlist() {
  yield takeLatest(fetchWishlistRequest.type, fetchWishlistSaga);
  yield takeLatest(toggleWishlistRequest.type, toggleWishlistSaga);
}
