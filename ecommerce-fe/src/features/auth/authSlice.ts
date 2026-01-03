import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Auth } from "../../types/Auth";

interface AsyncState {
  loading: boolean;
  error: string | null;
  otpSent: boolean;
  success?: boolean;
}

interface AuthState {
  user: Auth | null;
  token: string | null;

  login: AsyncState;
  loginOtp: AsyncState;

  register: AsyncState;
  registerOtp: AsyncState;
  initialized?: boolean;
}

const initialAsyncState: AsyncState = {
  loading: false,
  error: null,
  otpSent: false,
};

const initialState: AuthState = {
  user: null,
  token: null,
  initialized: false,

  login: { ...initialAsyncState },
  loginOtp: { ...initialAsyncState },

  register: { ...initialAsyncState, success: false },
  registerOtp: { ...initialAsyncState, success: false },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // ================= LOGIN =================
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

    // ================= LOGIN OTP =================
    verifyLoginOtpRequest(
      state,
      _action: PayloadAction<{ email: string; otp: string }>
    ) {
      state.loginOtp.loading = true;
      state.loginOtp.error = null;
      state.loginOtp.otpSent = false;
      state.loginOtp.success = false;
    },
    verifyLoginOtpSuccess(
      state,
      action: PayloadAction<{ user: Auth; token: string }>
    ) {
      state.loginOtp.loading = false;
      state.loginOtp.otpSent = false;
      state.loginOtp.success = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    verifyLoginOtpFailure(state, action: PayloadAction<string>) {
      state.loginOtp.loading = false;
      state.loginOtp.error = action.payload;
    },

    // ================= REGISTER =================
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

    // ================= REGISTER OTP =================
    verifyRegisterOtpRequest(
      state,
      _action: PayloadAction<{ email: string; otp: string }>
    ) {
      state.registerOtp.loading = true;
      state.registerOtp.error = null;
      state.registerOtp.success = false;
      state.registerOtp.otpSent = false;
    },
    verifyRegisterOtpSuccess(state) {
      state.registerOtp.loading = false;
      state.registerOtp.success = true;
      state.registerOtp.otpSent = false;
    },
    verifyRegisterOtpFailure(state, action: PayloadAction<string>) {
      state.registerOtp.loading = false;
      state.registerOtp.error = action.payload;
    },

    // ================= LOGOUT =================
    logout(state) {
      state.user = null;
      state.token = null;

      state.login = { ...initialAsyncState };
      state.loginOtp = { ...initialAsyncState };
      state.register = { ...initialAsyncState, success: false };
      state.registerOtp = { ...initialAsyncState, success: false };
    },

    hydrateAuth(state) {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");

      if (token && user) {
        state.token = token;
        state.user = JSON.parse(user);
      }
      state.initialized = true;
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

  logout,
  hydrateAuth,
} = authSlice.actions;

export default authSlice.reducer;
