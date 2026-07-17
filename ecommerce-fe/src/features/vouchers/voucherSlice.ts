import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { SaveVoucherPayload, Voucher } from "./voucher.types";

interface VoucherState {
  vouchers: Voucher[];
  loading: boolean;
  error: string | null;
}

const initialState: VoucherState = {
  vouchers: [],
  loading: false,
  error: null,
};

const voucherSlice = createSlice({
  name: "vouchers",
  initialState,
  reducers: {
    fetchVouchersRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchVouchersSuccess(state, action: PayloadAction<Voucher[]>) {
      state.loading = false;
      state.vouchers = action.payload;
    },

    saveVoucherRequest(state, _action: PayloadAction<SaveVoucherPayload>) {
      state.loading = true;
      state.error = null;
    },
    saveVoucherSuccess(state) {
      state.loading = false;
    },

    deleteVoucherRequest(state, _action: PayloadAction<{ id: number }>) {
      state.loading = true;
      state.error = null;
    },
    deleteVoucherSuccess(state) {
      state.loading = false;
    },

    vouchersFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchVouchersRequest,
  fetchVouchersSuccess,
  saveVoucherRequest,
  saveVoucherSuccess,
  deleteVoucherRequest,
  deleteVoucherSuccess,
  vouchersFailure,
} = voucherSlice.actions;

export default voucherSlice.reducer;
