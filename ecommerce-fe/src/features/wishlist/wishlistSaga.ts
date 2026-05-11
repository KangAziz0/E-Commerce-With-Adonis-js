import { SagaIterator } from "redux-saga";
import { call, put, select, takeLatest } from "redux-saga/effects";
import {
  addWishlistApi,
  fetchWishlistApi,
  removeWishlistApi,
} from "./wishlistService";
import {
  fetchWishlistRequest,
  fetchWishlistSuccess,
  toggleWishlistRequest,
  wishlistFailure,
} from "./wishlistSlice";
import { RootState } from "@/store/store";
import { mapProduct } from "@/mappers/productMapper";

function* fetchWishlist(): SagaIterator {
  try {
    const response = yield call(fetchWishlistApi);
    const data = response.map((item: any) => ({
      wishlistId: item.id,
      ...mapProduct(item.product),
    }));
    yield put(fetchWishlistSuccess(data));
  } catch (e: any) {
    yield put(
      wishlistFailure(e?.response?.data?.message || "Failed to fetch wishlist"),
    );
  }
}

function* toggleWishlist(
  action: ReturnType<typeof toggleWishlistRequest>,
): SagaIterator {
  try {
    const { productId } = action.payload;
    const items = yield select((state: RootState) => state.wishlist.items);
    const exists = items.some((item: any) => item.id === productId);
    console.log(exists);

    if (exists) {
      yield call(removeWishlistApi, productId);
    } else {
      yield call(addWishlistApi, productId);
    }

    const response = yield call(fetchWishlistApi);
    const data = response.map((item: any) => ({
      wishlistId: item.id,
      ...mapProduct(item.product),
    }));
    yield put(fetchWishlistSuccess(data));
  } catch (e: any) {
    yield put(
      wishlistFailure(
        e?.response?.data?.message || "Failed to update wishlist",
      ),
    );
  }
}

export default function* watchWishlist() {
  yield takeLatest(fetchWishlistRequest.type, fetchWishlist);
  yield takeLatest(toggleWishlistRequest.type, toggleWishlist);
}
