import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  CreateInvoicePayload,
  GetRatesParams,
  InvoiceResponse,
} from "./checkout.type";
import { CourierRate } from "@/components/common/CourierCard";

interface CheckoutState {
  rates: {
    data: any;
    loading: boolean;
    error: null | string;
  };
  invoice: {
    data: InvoiceResponse | null;
    status: string;
    error: string | null;
    loading: boolean;
  };
}

const initialState: CheckoutState = {
  invoice: {
    data: null,
    loading: false,
    error: null,
    status: "idle",
  },
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
    createInvoiceRequest(state, _action: PayloadAction<CreateInvoicePayload>) {
      state.invoice.loading = true;
      state.invoice.data = null;
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

export const {
  createInvoiceFailure,
  createInvoiceRequest,
  createInvoiceSuccess,
  getRatesRequest,
  getRatesSuccess,
  getRatesError,
} = checkoutSlice.actions;
export default checkoutSlice.reducer;
