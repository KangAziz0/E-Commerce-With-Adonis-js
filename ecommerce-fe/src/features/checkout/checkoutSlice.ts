import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  CourierRate,
  CreateInvoicePayload,
  GetRatesParams,
  InvoiceResponse,
  PaymentStatus,
} from "./checkout.types";

type InvoiceStatus = "idle" | "loading" | "awaiting_payment" | "failed";

interface PaymentState {
  polling: boolean;
  status: PaymentStatus | null;
  error: string | null;
}

interface CheckoutState {
  rates: {
    data: CourierRate[];
    loading: boolean;
    error: string | null;
  };
  invoice: {
    data: InvoiceResponse | null;
    status: InvoiceStatus;
    loading: boolean;
    error: string | null;
  };
  payment: PaymentState;
}

const initialState: CheckoutState = {
  rates: { data: [], loading: false, error: null },
  invoice: { data: null, status: "idle", loading: false, error: null },
  payment: { polling: false, status: null, error: null },
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    createInvoiceRequest(state, _action: PayloadAction<CreateInvoicePayload>) {
      state.invoice.loading = true;
      state.invoice.status = "loading";
      state.invoice.data = null;
      state.invoice.error = null;
    },
    createInvoiceSuccess(state, action: PayloadAction<InvoiceResponse>) {
      state.invoice.status = "awaiting_payment";
      state.invoice.data = action.payload;
      state.invoice.loading = false;
    },
    createInvoiceFailure(state, action: PayloadAction<string>) {
      state.invoice.error = action.payload;
      state.invoice.loading = false;
      state.invoice.status = "failed";
    },

    startPaymentPolling(state, _action: PayloadAction<string>) {
      state.payment.polling = true;
      state.payment.status = null;
      state.payment.error = null;
    },
    paymentStatusUpdated(state, action: PayloadAction<PaymentStatus>) {
      state.payment.status = action.payload;
      if (
        action.payload === "PAID" ||
        action.payload === "EXPIRED" ||
        action.payload === "FAILED"
      ) {
        state.payment.polling = false;
      }
    },
    stopPaymentPolling(state) {
      state.payment.polling = false;
    },
    paymentPollingError(state, action: PayloadAction<string>) {
      state.payment.error = action.payload;
      state.payment.polling = false;
    },

    getRatesRequest(state, _action: PayloadAction<GetRatesParams>) {
      state.rates.loading = true;
      state.rates.error = null;
    },
    getRatesSuccess(state, action: PayloadAction<CourierRate[]>) {
      state.rates.data = action.payload;
      state.rates.loading = false;
    },
    getRatesError(state, action: PayloadAction<string>) {
      state.rates.loading = false;
      state.rates.error = action.payload;
    },

    resetCheckout(state) {
      Object.assign(state, initialState);
    },
  },
});

export const {
  createInvoiceFailure,
  createInvoiceRequest,
  createInvoiceSuccess,
  startPaymentPolling,
  paymentStatusUpdated,
  stopPaymentPolling,
  paymentPollingError,
  getRatesRequest,
  getRatesSuccess,
  getRatesError,
  resetCheckout,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
