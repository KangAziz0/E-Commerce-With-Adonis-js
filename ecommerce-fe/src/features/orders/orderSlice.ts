import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { OrderDetail, OrderListItem, OrderStatus, MyOrdersState } from "./order.types";

interface OrderState {
  status: OrderStatus;
  order: OrderDetail | null;
  error: string | null;
  myOrders: MyOrdersState;
}

const initialState: OrderState = {
  status: "idle",
  order: null,
  error: null,
  myOrders: {
    orders: [],
    loading: false,
    error: null,
    isOpen: false,
  },
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
    resetCurrentOrder(state) {
      state.status = "idle";
      state.order = null;
      state.error = null;
    },
    fetchMyOrdersRequest(state) {
      state.myOrders.loading = true;
      state.myOrders.error = null;
    },
    fetchMyOrdersSuccess(state, action: PayloadAction<OrderListItem[]>) {
      state.myOrders.loading = false;
      state.myOrders.orders = action.payload;
    },
    fetchMyOrdersFailure(state, action: PayloadAction<string>) {
      state.myOrders.loading = false;
      state.myOrders.error = action.payload;
    },
    openMyOrders(state) {
      state.myOrders.isOpen = true;
    },
    closeMyOrders(state) {
      state.myOrders.isOpen = false;
    },
  },
});

export const {
  fetchOrderRequest,
  fetchOrderSuccess,
  fetchOrderFailure,
  resetCurrentOrder,
  fetchMyOrdersRequest,
  fetchMyOrdersSuccess,
  fetchMyOrdersFailure,
  openMyOrders,
  closeMyOrders,
} = orderSlice.actions;

export default orderSlice.reducer;
