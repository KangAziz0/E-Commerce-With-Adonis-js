import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Brand, SaveBrandPayload } from "./brand.types";

interface BrandState {
  brands: Brand[];
  loading: boolean;
  error: string | null;
}

const initialState: BrandState = {
  brands: [],
  loading: false,
  error: null,
};

const brandSlice = createSlice({
  name: "brands",
  initialState,
  reducers: {
    fetchBrandsRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchBrandsSuccess(state, action: PayloadAction<Brand[]>) {
      state.loading = false;
      state.brands = action.payload;
    },

    saveBrandRequest(state, _action: PayloadAction<SaveBrandPayload>) {
      state.loading = true;
      state.error = null;
    },
    saveBrandSuccess(state) {
      state.loading = false;
    },

    deleteBrandRequest(state, _action: PayloadAction<{ id: number }>) {
      state.loading = true;
      state.error = null;
    },
    deleteBrandSuccess(state) {
      state.loading = false;
    },

    brandsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchBrandsRequest,
  fetchBrandsSuccess,
  saveBrandRequest,
  saveBrandSuccess,
  deleteBrandRequest,
  deleteBrandSuccess,
  brandsFailure,
} = brandSlice.actions;

export default brandSlice.reducer;
