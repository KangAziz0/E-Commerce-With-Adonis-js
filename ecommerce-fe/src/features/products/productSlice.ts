import { ProductListMeta, FetchProductsParams } from "@/types/api/product";
import { Product } from "@/types/ui/product";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProductsState {
  data: Product[];
  loading: boolean;
  error: string | null;
  detail: Product | null;
  meta: ProductListMeta | null;
}

const initialState: ProductsState = {
  data: [],
  loading: false,
  error: null,
  detail: null,
  meta: null,
};
const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    fetchProductsRequest(state, _action: PayloadAction<FetchProductsParams | undefined>) {
      state.loading = true;
    },
    resetProductListing(state) {
      state.data = [];
      state.meta = null;
      state.error = null;
    },
    createProductRequest(state) { state.loading = true; },
    updateProductRequest(state) { state.loading = true; },
    deleteProductRequest(state) { state.loading = true; },

    fetchProductsSuccess(
      state,
      action: PayloadAction<{ items: Product[]; meta: ProductListMeta; append?: boolean }>,
    ) {
      state.loading = false;
      state.data = action.payload.append ? [...state.data, ...action.payload.items] : action.payload.items;
      state.meta = action.payload.meta;
    },
    createProductSuccess(state, action: PayloadAction<Product>) { state.loading = false; state.data.unshift(action.payload); },
    updateProductSuccess(state) { state.loading = false; },
    deleteProductSuccess(state) { state.loading = false; },
    productsFailure(state, action: PayloadAction<string>) { state.loading = false; state.error = action.payload; },
    fetchDetailProductRequest(state) { state.loading = true; state.error = null; state.detail = null; },
    fetchDetailProductSuccess(state, action) { state.loading = false; state.detail = action.payload; state.error = null; },
    fetchDetailProductFailure(state, action) { state.loading = false; state.error = action.payload; state.detail = null; },
  },
});

export const { fetchProductsRequest, fetchProductsSuccess, resetProductListing, updateProductRequest, updateProductSuccess, createProductRequest, createProductSuccess, deleteProductRequest, deleteProductSuccess, fetchDetailProductFailure, fetchDetailProductRequest, fetchDetailProductSuccess, productsFailure } = productsSlice.actions;
export default productsSlice.reducer;
