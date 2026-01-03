import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../../types/Product";

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  loading: false,
  error: null,
};
const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    fetchProductsRequest(state) {
      state.loading = true;
    },
    createProductRequest(state) {
      state.loading = true;
    },
    updateProductRequest(state) {
      state.loading = true;
    },
    deleteProductRequest(state) {
      state.loading = true;
    },

    fetchProductsSuccess(state, action: PayloadAction<Product[]>) {
      state.loading = false;
      state.products = action.payload;
    },

    createProductSuccess(state, action: PayloadAction<Product>) {
      state.loading = false;
      state.products.unshift(action.payload);
    },

    updateProductSuccess(state) {
      state.loading = false;
    },

    deleteProductSuccess(state) {
      state.loading = false;
    },

    productsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchProductsRequest,
  fetchProductsSuccess,
  updateProductRequest,
  updateProductSuccess,
  createProductRequest,
  createProductSuccess,
  deleteProductRequest,
  deleteProductSuccess,
  productsFailure,
} = productsSlice.actions;

export default productsSlice.reducer;
