import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  user: any | null;
  token: string | null;

  login: {
    loading: boolean;
    error: string | null;
  };

  register: {
    loading: boolean;
    error: string | null;
    success: boolean;
  };
}

const initialState: AuthState = {
  user: null,
  token: null,

  login: {
    loading: false,
    error: null,
  },

  register: {
    loading: false,
    error: null,
    success: false,
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // ========= LOGIN =========
    loginRequest(state, action) {
      state.login.loading = true;
      state.login.error = null;
    },
    loginSuccess(state, action) {
      state.login.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    loginFailure(state, action) {
      state.login.loading = false;
      state.login.error = action.payload;
    },

    // ========= REGISTER =========
    registerRequest(state, action) {
      state.register.loading = true;
      state.register.error = null;
      state.register.success = false;
    },
    registerSuccess(state) {
      state.register.loading = false;
      state.register.success = true;
    },
    registerFailure(state, action) {
      state.register.loading = false;
      state.register.error = action.payload;
    },

    // ========= LOGOUT =========
    logout(state) {
      state.user = null;
      state.token = null;
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  registerRequest,
  registerSuccess,
  registerFailure,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
