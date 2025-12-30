import { createSlice } from "@reduxjs/toolkit";

interface ProductsState {
  products: any[];
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
    fetchProductsSuccess(state, action) {
      state.loading = false;
      state.products = action.payload;
      state.error = null;
    },
    fetchProductsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    addProductSuccess(state, action) {
      state.products.push(action.payload);
    },
  },
});

export const {
  fetchProductsRequest,
  fetchProductsSuccess,
  fetchProductsFailure,
  addProductSuccess,
} = productsSlice.actions;
export default productsSlice.reducer;
