import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { OrderDetail, OrderStatus } from "./order.types";

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
    fetchOrderFailure(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
    resetOrder(state) {
      Object.assign(state, initialState);
    },
  },
});

export const {
  fetchOrderRequest,
  fetchOrderSuccess,
  fetchOrderFailure,
  resetOrder,
} = orderSlice.actions;

export default orderSlice.reducer;
