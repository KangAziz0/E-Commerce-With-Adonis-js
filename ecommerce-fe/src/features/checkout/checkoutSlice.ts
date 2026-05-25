import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  CourierRate,
  CreateOrderPayload,
  CreateOrderResponse,
  CreatePaymentPayload,
  GetRatesParams,
  PaymentChannel,
  PaymentMethod,
  PaymentResponse,
} from "./checkout.types";

export type CheckoutStep =
  | "shipping"
  | "payment_method"
  | "awaiting_payment"
  | "completed";

interface CheckoutState {
  rates: {
    data: CourierRate[];
    loading: boolean;
    error: string | null;
  };
  order: {
    data: CreateOrderResponse | null;
    loading: boolean;
    error: string | null;
  };
  payment: {
    data: PaymentResponse | null;
    loading: boolean;
    error: string | null;
    polling: boolean;
    selectedMethod: PaymentMethod | null;
    selectedChannel: PaymentChannel | null;
  };
  step: CheckoutStep;
}

const initialState: CheckoutState = {
  rates: { data: [], loading: false, error: null },
  order: { data: null, loading: false, error: null },
  payment: {
    data: null,
    loading: false,
    error: null,
    polling: false,
    selectedMethod: null,
    selectedChannel: null,
  },
  step: "shipping",
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    // Rates
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

    // Order
    createOrderRequest(state, _action: PayloadAction<CreateOrderPayload>) {
      state.order.loading = true;
      state.order.error = null;
    },
    createOrderSuccess(state, action: PayloadAction<CreateOrderResponse>) {
      state.order.data = action.payload;
      state.order.loading = false;
      state.step = "payment_method";
    },
    createOrderFailure(state, action: PayloadAction<string>) {
      state.order.error = action.payload;
      state.order.loading = false;
    },

    // Payment method selection
    selectPaymentMethod(
      state,
      action: PayloadAction<{
        method: PaymentMethod;
        channel?: PaymentChannel;
      }>
    ) {
      state.payment.selectedMethod = action.payload.method;
      state.payment.selectedChannel = action.payload.channel ?? null;
    },

    // Create payment
    createPaymentRequest(state, _action: PayloadAction<CreatePaymentPayload>) {
      state.payment.loading = true;
      state.payment.error = null;
    },
    createPaymentSuccess(state, action: PayloadAction<PaymentResponse>) {
      state.payment.data = action.payload;
      state.payment.loading = false;
      state.step = "awaiting_payment";
    },
    createPaymentFailure(state, action: PayloadAction<string>) {
      state.payment.error = action.payload;
      state.payment.loading = false;
    },

    // Polling
    startPaymentPolling(state, _action: PayloadAction<number>) {
      state.payment.polling = true;
      state.payment.error = null;
    },
    stopPaymentPolling(state) {
      state.payment.polling = false;
    },
    paymentStatusUpdated(state, action: PayloadAction<PaymentResponse>) {
      state.payment.data = action.payload;
      if (
        action.payload.status === "PAID" ||
        action.payload.status === "EXPIRED" ||
        action.payload.status === "FAILED"
      ) {
        state.payment.polling = false;
        if (action.payload.status === "PAID") {
          state.step = "completed";
        }
      }
    },
    paymentPollingError(state, action: PayloadAction<string>) {
      state.payment.error = action.payload;
      state.payment.polling = false;
    },

    // Step navigation
    setStep(state, action: PayloadAction<CheckoutStep>) {
      state.step = action.payload;
    },

    // Reset
    resetCheckout(state) {
      Object.assign(state, initialState);
    },
  },
});

export const {
  getRatesRequest,
  getRatesSuccess,
  getRatesError,
  createOrderRequest,
  createOrderSuccess,
  createOrderFailure,
  selectPaymentMethod,
  createPaymentRequest,
  createPaymentSuccess,
  createPaymentFailure,
  startPaymentPolling,
  stopPaymentPolling,
  paymentStatusUpdated,
  paymentPollingError,
  setStep,
  resetCheckout,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
