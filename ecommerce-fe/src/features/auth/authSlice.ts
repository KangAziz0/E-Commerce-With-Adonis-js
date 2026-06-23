import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types/user";
import type {
  LoginPayload,
  RegisterPayload,
  ResendOtpPayload,
  VerifyOtpPayload,
} from "./auth.types";
import type { UpdateProfilePayload } from "./profileService";

interface AsyncState {
  loading: boolean;
  error: string | null;
  otpSent: boolean;
  success?: boolean;
}

interface ProfileAsyncState {
  loading: boolean;
  error: string | null;
}

interface AuthState {
  user: User | null;
  initialized: boolean;
  isLoginOpen: boolean;

  login: AsyncState;
  loginOtp: AsyncState;
  register: AsyncState;
  registerOtp: AsyncState;
  resendOtp: AsyncState;
  profile: ProfileAsyncState;
  avatarUpload: ProfileAsyncState;
}

const initialAsyncState: AsyncState = {
  loading: false,
  error: null,
  otpSent: false,
};

const initialProfileState: ProfileAsyncState = {
  loading: false,
  error: null,
};

const initialState: AuthState = {
  user: null,
  initialized: false,
  isLoginOpen: false,

  login: { ...initialAsyncState },
  loginOtp: { ...initialAsyncState },
  register: { ...initialAsyncState, success: false },
  registerOtp: { ...initialAsyncState, success: false },
  resendOtp: { ...initialAsyncState },
  profile: { ...initialProfileState },
  avatarUpload: { ...initialProfileState },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /* ===== LOGIN ===== */
    loginRequest(state, _action: PayloadAction<LoginPayload>) {
      state.login.loading = true;
      state.login.error = null;
      state.login.otpSent = false;
      state.registerOtp.otpSent = false;
    },
    loginOtpSent(state) {
      state.login.loading = false;
      state.login.otpSent = true;
    },
    loginSuccess(state) {
      state.login.loading = false;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.login.loading = false;
      state.login.error = action.payload;
    },

    /* ===== LOGIN OTP ===== */
    verifyLoginOtpRequest(state, _action: PayloadAction<VerifyOtpPayload>) {
      state.loginOtp.loading = true;
      state.loginOtp.error = null;
      state.loginOtp.success = false;
    },
    verifyLoginOtpSuccess(state, action: PayloadAction<{ user: User }>) {
      state.loginOtp.loading = false;
      state.loginOtp.success = true;
      state.user = action.payload.user;
    },
    verifyLoginOtpFailure(state, action: PayloadAction<string>) {
      state.loginOtp.loading = false;
      state.loginOtp.error = action.payload;
    },

    /* ===== REGISTER ===== */
    registerRequest(state, _action: PayloadAction<RegisterPayload>) {
      state.register.loading = true;
      state.register.error = null;
      state.register.otpSent = false;
      state.login.otpSent = false;
    },
    registerOtpSent(state) {
      state.register.loading = false;
      state.register.otpSent = true;
    },
    registerSuccess(state) {
      state.register.loading = false;
    },
    registerFailure(state, action: PayloadAction<string>) {
      state.register.loading = false;
      state.register.error = action.payload;
    },

    /* ===== REGISTER OTP ===== */
    verifyRegisterOtpRequest(state, _action: PayloadAction<VerifyOtpPayload>) {
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

    /* ===== ME ===== */
    fetchMeRequest(state) {
      state.initialized = false;
    },
    fetchMeSuccess(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.initialized = true;
    },
    fetchMeFailure(state) {
      state.user = null;
      state.initialized = true;
    },

    /* ===== RESEND OTP ===== */
    resendOtpRequest(state, _action: PayloadAction<ResendOtpPayload>) {
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

    /* ===== UPDATE PROFILE ===== */
    updateProfileRequest(state, _action: PayloadAction<UpdateProfilePayload>) {
      state.profile.loading = true;
      state.profile.error = null;
    },
    updateProfileSuccess(state, action: PayloadAction<User>) {
      state.profile.loading = false;
      state.user = action.payload;
    },
    updateProfileFailure(state, action: PayloadAction<string>) {
      state.profile.loading = false;
      state.profile.error = action.payload;
    },

    /* ===== UPLOAD AVATAR ===== */
    uploadAvatarRequest(state, _action: PayloadAction<FormData>) {
      state.avatarUpload.loading = true;
      state.avatarUpload.error = null;
    },
    uploadAvatarSuccess(state, action: PayloadAction<User>) {
      state.avatarUpload.loading = false;
      state.user = action.payload;
    },
    uploadAvatarFailure(state, action: PayloadAction<string>) {
      state.avatarUpload.loading = false;
      state.avatarUpload.error = action.payload;
    },

    /* ===== LOGOUT & MODAL ===== */
    logout(state) {
      state.user = null;
      state.initialized = true;
      state.login = { ...initialAsyncState };
      state.loginOtp = { ...initialAsyncState };
      state.register = { ...initialAsyncState, success: false };
      state.registerOtp = { ...initialAsyncState, success: false };
      state.profile = { ...initialProfileState };
      state.avatarUpload = { ...initialProfileState };
    },
    openModalLogin(state) {
      state.isLoginOpen = true;
    },
    closeModalLogin(state) {
      state.isLoginOpen = false;
    },
  },
});

export const {
  loginRequest,
  loginOtpSent,
  loginSuccess,
  loginFailure,
  verifyLoginOtpRequest,
  verifyLoginOtpSuccess,
  verifyLoginOtpFailure,
  registerRequest,
  registerSuccess,
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
  updateProfileRequest,
  updateProfileSuccess,
  updateProfileFailure,
  uploadAvatarRequest,
  uploadAvatarSuccess,
  uploadAvatarFailure,
  logout,
  openModalLogin,
  closeModalLogin,
} = authSlice.actions;

export default authSlice.reducer;
