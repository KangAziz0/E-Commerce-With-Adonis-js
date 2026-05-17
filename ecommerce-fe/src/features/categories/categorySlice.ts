import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Category } from "@/types/category";
import type { SaveCategoryPayload } from "./category.types";

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    fetchCategoriesRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchCategoriesSuccess(state, action: PayloadAction<Category[]>) {
      state.loading = false;
      state.categories = action.payload;
    },

    saveCategoryRequest(state, _action: PayloadAction<SaveCategoryPayload>) {
      state.loading = true;
      state.error = null;
    },
    saveCategorySuccess(state) {
      state.loading = false;
    },

    deleteCategoryRequest(state, _action: PayloadAction<{ id: number }>) {
      state.loading = true;
      state.error = null;
    },
    deleteCategorySuccess(state) {
      state.loading = false;
    },

    categoriesFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchCategoriesRequest,
  fetchCategoriesSuccess,
  saveCategoryRequest,
  saveCategorySuccess,
  deleteCategoryRequest,
  deleteCategorySuccess,
  categoriesFailure,
} = categorySlice.actions;

export default categorySlice.reducer;
