import type { SagaIterator } from "redux-saga";
import { call, debounce, put, select } from "redux-saga/effects";

import { mapProduct } from "@/mappers/productMapper";
import type { Product } from "@/types/ui/product";
import type { RootState } from "@/store/store";
import productService from "@/features/products/productService";
import {
  setSearchQuery,
  searchSuggestionsSuccess,
  searchSuggestionsFailure,
} from "./searchSlice";

const MIN_CHARS = 3;
const DEBOUNCE_MS = 500;
const SUGGESTION_LIMIT = 6;

function* fetchSuggestionsSaga(): SagaIterator {
  const query: string = yield select(
    (state: RootState) => state.search.query,
  );

  const trimmed = query.trim();

  // Safety check — don't hit API if below minimum characters
  if (trimmed.length < MIN_CHARS) {
    yield put(searchSuggestionsSuccess([]));
    return;
  }

  try {
    const response = yield call(productService.getAll, {
      page: 1,
      limit: SUGGESTION_LIMIT,
      search: trimmed,
    });

    const payload = response.data?.data;
    const items: Product[] = (payload?.items ?? []).map(mapProduct);

    yield put(searchSuggestionsSuccess(items));
  } catch {
    yield put(searchSuggestionsFailure());
  }
}

/**
 * Uses redux-saga `debounce` — waits for the user to stop typing for
 * DEBOUNCE_MS before firing the API call. Much cleaner than local
 * setTimeout/useDebounce hooks.
 */
export default function* watchSearch() {
  yield debounce(DEBOUNCE_MS, setSearchQuery.type, fetchSuggestionsSaga);
}
