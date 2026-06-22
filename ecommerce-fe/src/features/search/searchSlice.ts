import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "@/types/ui/product";

export interface SearchSuggestion
  extends Pick<Product, "id" | "name" | "price" | "images" | "category"> {}

interface SearchState {
  query: string;
  suggestions: SearchSuggestion[];
  loading: boolean;
}

const initialState: SearchState = {
  query: "",
  suggestions: [],
  loading: false,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    /** Dispatched every time the user types in the search input */
    setSearchQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;

      // Immediately clear suggestions when query is below minimum
      if (action.payload.trim().length < 3) {
        state.suggestions = [];
        state.loading = false;
      } else {
        state.loading = true;
      }
    },

    /** Saga dispatches this on successful API response */
    searchSuggestionsSuccess(
      state,
      action: PayloadAction<SearchSuggestion[]>,
    ) {
      state.suggestions = action.payload;
      state.loading = false;
    },

    /** Saga dispatches this on error */
    searchSuggestionsFailure(state) {
      state.suggestions = [];
      state.loading = false;
    },

    /** Reset all search state (e.g. when closing the panel) */
    resetSearch(state) {
      state.query = "";
      state.suggestions = [];
      state.loading = false;
    },
  },
});

export const {
  setSearchQuery,
  searchSuggestionsSuccess,
  searchSuggestionsFailure,
  resetSearch,
} = searchSlice.actions;

export default searchSlice.reducer;
