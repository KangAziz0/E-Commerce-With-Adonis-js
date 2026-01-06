import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Auth, ResendOtp } from "../../types/Auth";

interface AsyncState {
  loading: boolean;
  error: string | null;
  otpSent: boolean;
  success?: boolean;
}

interface AuthState {
  user: Auth | null;
  resendOtp: AsyncState;
  initialized: boolean;

  login: AsyncState;
  loginOtp: AsyncState;

  register: AsyncState;
  registerOtp: AsyncState;
}

const initialAsyncState: AsyncState = {
  loading: false,
  error: null,
  otpSent: false,
};

const initialState: AuthState = {
  user: null,
  initialized: false,

  login: { ...initialAsyncState },
  loginOtp: { ...initialAsyncState },

  register: { ...initialAsyncState, success: false },
  registerOtp: { ...initialAsyncState, success: false },
  resendOtp: { ...initialAsyncState },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /* ================= LOGIN ================= */
    loginRequest(
      state,
      _action: PayloadAction<{ email: string; password: string }>
    ) {
      state.login.loading = true;
      state.login.error = null;
      state.login.otpSent = false;
    },

    loginOtpSent(state) {
      state.login.loading = false;
      state.login.otpSent = true;
    },

    loginFailure(state, action: PayloadAction<string>) {
      state.login.loading = false;
      state.login.error = action.payload;
    },

    /* ================= LOGIN OTP ================= */
    verifyLoginOtpRequest(
      state,
      _action: PayloadAction<{ email: string; otp: string }>
    ) {
      state.loginOtp.loading = true;
      state.loginOtp.error = null;
      state.loginOtp.success = false;
    },

    verifyLoginOtpSuccess(state, action: PayloadAction<{ user: Auth }>) {
      state.loginOtp.loading = false;
      state.loginOtp.success = true;
      state.user = action.payload.user;
    },

    verifyLoginOtpFailure(state, action: PayloadAction<string>) {
      state.loginOtp.loading = false;
      state.loginOtp.error = action.payload;
    },

    /* ================= REGISTER ================= */
    registerRequest(
      state,
      _action: PayloadAction<{ name: string; email: string; password: string }>
    ) {
      state.register.loading = true;
      state.register.error = null;
      state.register.otpSent = false;
    },

    registerOtpSent(state) {
      state.register.loading = false;
      state.register.otpSent = true;
    },

    registerFailure(state, action: PayloadAction<string>) {
      state.register.loading = false;
      state.register.error = action.payload;
    },

    /* ================= REGISTER OTP ================= */
    verifyRegisterOtpRequest(
      state,
      _action: PayloadAction<{ email: string; otp: string }>
    ) {
      state.registerOtp.loading = true;
      state.registerOtp.error = null;
      state.registerOtp.success = false;
    },

    verifyRegisterOtpSuccess(state) {
      state.registerOtp.loading = false;
      state.registerOtp.success = true;
    },

    verifyRegisterOtpFailure(state, action: PayloadAction<string>) {
      state.registerOtp.loading = false;
      state.registerOtp.error = action.payload;
    },

    /* ================= FETCH ME ================= */
    fetchMeRequest(state) {
      state.initialized = false;
    },

    fetchMeSuccess(state, action: PayloadAction<Auth>) {
      state.user = action.payload;
      state.initialized = true;
    },

    fetchMeFailure(state) {
      state.user = null;
      state.initialized = true;
    },

    resendOtpRequest(
      state,
      _action: PayloadAction<{ email: string; purpose: string }>
    ) {
      state.resendOtp.loading = true;
    },

    resendOtpSuccess(state) {
      state.resendOtp.loading = false;
      state.resendOtp.success = true;
    },

    resendOtpFailure(state, action: PayloadAction<{ error: string }>) {
      state.resendOtp.loading = false;
      state.resendOtp.error = action.payload.error;
    },

    /* ================= LOGOUT ================= */
    logout(state) {
      state.user = null;
      state.initialized = true;

      state.login = { ...initialAsyncState };
      state.loginOtp = { ...initialAsyncState };
      state.register = { ...initialAsyncState, success: false };
      state.registerOtp = { ...initialAsyncState, success: false };
    },
  },
});

export const {
  loginRequest,
  loginOtpSent,
  loginFailure,

  verifyLoginOtpRequest,
  verifyLoginOtpSuccess,
  verifyLoginOtpFailure,

  registerRequest,
  registerOtpSent,
  registerFailure,

  verifyRegisterOtpRequest,
  verifyRegisterOtpSuccess,
  verifyRegisterOtpFailure,

  fetchMeRequest,
  fetchMeSuccess,
  fetchMeFailure,

  resendOtpRequest,
  resendOtpFailure,
  resendOtpSuccess,

  logout,
} = authSlice.actions;

export default authSlice.reducer;
