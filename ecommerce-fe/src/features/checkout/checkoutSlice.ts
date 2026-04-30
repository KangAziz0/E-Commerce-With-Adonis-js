import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GetRatesParams } from "./checkout.type";
import { CourierRate } from "@/components/common/CourierCard";

interface CheckoutState {
  rates: {
    data: any;
    loading: boolean;
    error: null | string;
  };
}

const initialState: CheckoutState = {
  rates: {
    data: [],
    loading: false,
    error: null,
  },
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    getRatesRequest(state, _action: PayloadAction<GetRatesParams>) {
      state.rates.loading = true;
      state.rates.error = null;
    },
    getRatesSuccess(state, action: PayloadAction<CourierRate[]>) {
      // ← array
      state.rates.data = action.payload;
      state.rates.loading = false;
    },
    getRatesError(state, action: PayloadAction<string>) {
      state.rates.loading = false;
      state.rates.error = action.payload;
    },
    reset() {
      initialState;
    },
  },
});

export const { getRatesRequest, getRatesSuccess, getRatesError } =
  checkoutSlice.actions;
export default checkoutSlice.reducer;
