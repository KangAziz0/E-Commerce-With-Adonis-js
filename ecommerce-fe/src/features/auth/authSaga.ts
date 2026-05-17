import { call, put, takeLatest } from "redux-saga/effects";
import type { SagaIterator } from "redux-saga";
import type { PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import { env } from "@/config/env";
import { getErrorMessage } from "@/lib/errorMessage";
import authService from "./authService";
import {
  fetchMeFailure,
  fetchMeRequest,
  fetchMeSuccess,
  loginFailure,
  loginOtpSent,
  loginRequest,
  loginSuccess,
  logout,
  registerFailure,
  registerOtpSent,
  registerRequest,
  registerSuccess,
  resendOtpFailure,
  resendOtpRequest,
  resendOtpSuccess,
  verifyLoginOtpFailure,
  verifyLoginOtpRequest,
  verifyLoginOtpSuccess,
  verifyRegisterOtpFailure,
  verifyRegisterOtpRequest,
  verifyRegisterOtpSuccess,
} from "./authSlice";
import type {
  LoginPayload,
  RegisterPayload,
  ResendOtpPayload,
  VerifyOtpPayload,
} from "./auth.types";

/* ===== LOGIN ===== */
function* loginSaga(action: PayloadAction<LoginPayload>): SagaIterator {
  try {
    yield call(authService.login, action.payload);
    if (env.otpEnabled) {
      yield put(loginOtpSent());
      toast.success("OTP berhasil dikirim ke email");
    } else {
      yield put(loginSuccess());
      yield put(fetchMeRequest());
    }
  } catch (error) {
    const message = getErrorMessage(error, "Login gagal");
    yield put(loginFailure(message));
    toast.error(message);
  }
}

/* ===== LOGIN OTP ===== */
function* verifyLoginOtpSaga(
  action: PayloadAction<VerifyOtpPayload>,
): SagaIterator {
  try {
    const response = yield call(authService.verifyLoginOtp, action.payload);
    const user = response.data?.data?.user;
    yield put(verifyLoginOtpSuccess({ user }));
    toast.success("Login berhasil");
  } catch (error) {
    const message = getErrorMessage(error, "OTP tidak valid");
    yield put(verifyLoginOtpFailure(message));
    toast.error(message);
  }
}

/* ===== REGISTER ===== */
function* registerSaga(action: PayloadAction<RegisterPayload>): SagaIterator {
  try {
    yield call(authService.register, action.payload);
    if (env.otpEnabled) {
      yield put(registerOtpSent());
      toast.success("Registrasi berhasil, cek email untuk OTP");
    } else {
      yield put(registerSuccess());
    }
  } catch (error) {
    const message = getErrorMessage(error, "Registrasi gagal");
    yield put(registerFailure(message));
    toast.error(message);
  }
}

/* ===== REGISTER OTP ===== */
function* verifyRegisterOtpSaga(
  action: PayloadAction<VerifyOtpPayload>,
): SagaIterator {
  try {
    yield call(authService.verifyRegisterOtp, action.payload);
    yield put(verifyRegisterOtpSuccess());
    toast.success("Verifikasi berhasil, silakan login");
  } catch (error) {
    const message = getErrorMessage(error, "OTP tidak valid");
    yield put(verifyRegisterOtpFailure(message));
    toast.error(message);
  }
}

/* ===== RESEND OTP ===== */
function* resendOtpSaga(
  action: PayloadAction<ResendOtpPayload>,
): SagaIterator {
  try {
    const response = yield call(authService.resendOtp, action.payload);
    yield put(resendOtpSuccess());
    toast.success(response.data?.message ?? "OTP berhasil dikirim ulang");
  } catch (error) {
    const message = getErrorMessage(error, "Gagal kirim ulang OTP");
    yield put(resendOtpFailure({ error: message }));
    toast.error(message);
  }
}

/* ===== LOGOUT ===== */
function* logoutSaga(): SagaIterator {
  try {
    yield call(authService.logout);
    toast.success("Berhasil logout");
  } catch (error) {
    toast.warning(getErrorMessage(error, "Logout gagal"));
  }
}

/* ===== ME ===== */
function* fetchMeSaga(): SagaIterator {
  try {
    const response = yield call(authService.me);
    yield put(fetchMeSuccess(response.data?.data));
  } catch {
    yield put(fetchMeFailure());
  }
}

export default function* watchAuth() {
  yield takeLatest(loginRequest.type, loginSaga);
  yield takeLatest(verifyLoginOtpRequest.type, verifyLoginOtpSaga);
  yield takeLatest(logout.type, logoutSaga);
  yield takeLatest(fetchMeRequest.type, fetchMeSaga);
  yield takeLatest(resendOtpRequest.type, resendOtpSaga);
  yield takeLatest(registerRequest.type, registerSaga);
  yield takeLatest(verifyRegisterOtpRequest.type, verifyRegisterOtpSaga);
}
