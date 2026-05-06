import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { OrderStatus, OrderDetail } from "./order.type";

interface OrderState {
  status: OrderStatus;
  order: OrderDetail | null;
  error: string | null;
}

const initialState: OrderState = {
  status: "idle",
  order: null,
  error: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    fetchOrderRequest(state, _action: PayloadAction<string>) {
      state.status = "loading";
      state.error = null;
    },
    fetchOrderSuccess(state, action: PayloadAction<OrderDetail>) {
      state.status = "success";
      state.order = action.payload;
    },

    checkoutFailure(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    resetCheckout(state) {
      Object.assign(state, initialState);
    },
  },
});

export const {
  fetchOrderRequest,
  fetchOrderSuccess,
  checkoutFailure,
  resetCheckout,
} = orderSlice.actions;

export default orderSlice.reducer;
