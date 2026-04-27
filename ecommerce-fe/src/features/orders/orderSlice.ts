import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  OrderStatus,
  CreateInvoicePayload,
  InvoiceResponse,
  OrderDetail,
} from "./order.type";

interface OrderState {
  status: OrderStatus;
  invoice: InvoiceResponse | null;
  order: OrderDetail | null;
  error: string | null;
}

const initialState: OrderState = {
  status: "idle",
  invoice: null,
  order: null,
  error: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    // Actions yang di-trigger dari component
    createInvoiceRequest(state, _action: PayloadAction<CreateInvoicePayload>) {
      state.status = "loading";
      state.error = null;
    },
    fetchOrderRequest(state, _action: PayloadAction<string>) {
      state.status = "loading";
      state.error = null;
    },

    createInvoiceSuccess(state, action: PayloadAction<InvoiceResponse>) {
      state.status = "redirecting";
      state.invoice = action.payload;
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
  createInvoiceRequest,
  createInvoiceSuccess,
  fetchOrderRequest,
  fetchOrderSuccess,
  checkoutFailure,
  resetCheckout,
} = orderSlice.actions;

export default orderSlice.reducer;
