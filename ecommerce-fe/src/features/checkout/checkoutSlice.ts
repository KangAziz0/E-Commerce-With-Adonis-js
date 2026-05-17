import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  CourierRate,
  CreateInvoicePayload,
  GetRatesParams,
  InvoiceResponse,
} from "./checkout.types";

type InvoiceStatus = "idle" | "loading" | "redirecting" | "failed";

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
}

const initialState: CheckoutState = {
  rates: { data: [], loading: false, error: null },
  invoice: { data: null, status: "idle", loading: false, error: null },
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
      state.invoice.status = "redirecting";
      state.invoice.data = action.payload;
      state.invoice.loading = false;
    },
    createInvoiceFailure(state, action: PayloadAction<string>) {
      state.invoice.error = action.payload;
      state.invoice.loading = false;
      state.invoice.status = "failed";
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
  getRatesRequest,
  getRatesSuccess,
  getRatesError,
  resetCheckout,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
