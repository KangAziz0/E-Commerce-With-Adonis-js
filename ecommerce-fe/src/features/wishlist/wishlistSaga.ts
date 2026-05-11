import { SagaIterator } from 'redux-saga'
import { call, put, select, takeLatest } from 'redux-saga/effects'
import { addWishlistApi, fetchWishlistApi, removeWishlistApi } from './wishlistService'
import { fetchWishlistRequest, fetchWishlistSuccess, toggleWishlistRequest, wishlistFailure } from './wishlistSlice'
import { RootState } from '@/store/store'

function* fetchWishlist(): SagaIterator {
  try {
    const data = yield call(fetchWishlistApi)
    yield put(fetchWishlistSuccess(data))
  } catch (e: any) {
    yield put(wishlistFailure(e?.response?.data?.message || 'Failed to fetch wishlist'))
  }
}

function* toggleWishlist(action: ReturnType<typeof toggleWishlistRequest>): SagaIterator {
  try {
    const { productId } = action.payload
    const items = yield select((state: RootState) => state.wishlist.items)
    const exists = items.some((item: any) => item.productId === productId)

    if (exists) {
      yield call(removeWishlistApi, productId)
    } else {
      yield call(addWishlistApi, productId)
    }

    const data = yield call(fetchWishlistApi)
    yield put(fetchWishlistSuccess(data))
  } catch (e: any) {
    yield put(wishlistFailure(e?.response?.data?.message || 'Failed to update wishlist'))
  }
}

export default function* watchWishlist() {
  yield takeLatest(fetchWishlistRequest.type, fetchWishlist)
  yield takeLatest(toggleWishlistRequest.type, toggleWishlist)
}
