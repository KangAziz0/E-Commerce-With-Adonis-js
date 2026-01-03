import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Category } from "../../types/Category";

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

    // ===== CREATE =====
    createCategoryRequest(state) {
      state.loading = true;
      state.error = null;
    },
    createCategorySuccess(state, action: PayloadAction<Category>) {
      state.loading = false;
      state.categories.unshift(action.payload);
    },

    // ===== UPDATE =====
    updateCategoryRequest(state) {
      state.loading = true;
      state.error = null;
    },
    updateCategorySuccess(state) {
      state.loading = false;
    },

    // ===== DELETE =====
    deleteCategoryRequest(state) {
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
  createCategoryRequest,
  createCategorySuccess,
  updateCategoryRequest,
  updateCategorySuccess,
  deleteCategoryRequest,
  deleteCategorySuccess,
  categoriesFailure,
} = categorySlice.actions;

export default categorySlice.reducer;
