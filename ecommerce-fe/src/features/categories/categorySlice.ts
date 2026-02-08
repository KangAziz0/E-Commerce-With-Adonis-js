import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Category } from "../../types/Category";
import { SaveCategoryPayload } from "./category.types";

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
    // ===== FETCH =====
    fetchCategoriesRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchCategoriesSuccess(state, action: PayloadAction<Category[]>) {
      state.loading = false;
      state.categories = action.payload;
    },

    saveCategoryRequest(state, action: PayloadAction<SaveCategoryPayload>) {
      state.loading = true;
      state.error = null;
    },

    saveCategorySuccess(state) {
      state.loading = false;
    },

    // ===== DELETE =====
    deleteCategoryRequest(state, action: PayloadAction<{ id: number }>) {
      state.loading = true;
      state.error = null;
    },
    deleteCategorySuccess(state) {
      state.loading = false;
    },

    // ===== FAILURE =====
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
