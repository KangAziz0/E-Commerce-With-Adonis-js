import { call, put, takeLatest } from "redux-saga/effects";
import { toast } from "react-toastify";
import authService from "./authService";

import {
  loginRequest,
  loginFailure,
  verifyLoginOtpRequest,
  verifyLoginOtpSuccess,
  verifyLoginOtpFailure,
  registerRequest,
  registerFailure,
  verifyRegisterOtpRequest,
  verifyRegisterOtpSuccess,
  verifyRegisterOtpFailure,
  loginOtpSent,
  registerOtpSent,
  logout,
} from "./authSlice";

/* ================= LOGIN ================= */
function* loginSaga(action: any): any {
  try {
    yield call(authService.login, action.payload);

    yield put(loginOtpSent());
    toast.success("OTP berhasil dikirim ke email");
  } catch (err: any) {
    const message = err.response?.data?.message || "Login gagal";
    yield put(loginFailure(message));
    toast.error(message);
  }
}

/* ================= LOGIN OTP ================= */
function* verifyLoginOtpSaga(action: any): any {
  try {
    const response = yield call(authService.verifyLoginOtp, action.payload);

    const { user, token } = response.data.data;

    yield put(verifyLoginOtpSuccess({ user, token }));

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    toast.success("Login berhasil");
  } catch (err: any) {
    const message = err.response?.data?.message || "OTP tidak valid";
    yield put(verifyLoginOtpFailure(message));
    toast.error(message);
  }
}

/* ================= REGISTER ================= */
function* registerSaga(action: any): any {
  try {
    yield call(authService.register, action.payload);
    yield put(registerOtpSent());
    toast.success("Registrasi berhasil, cek email untuk OTP");
  } catch (err: any) {
    const message = err.response?.data?.message || "Registrasi gagal";
    yield put(registerFailure(message));
    toast.error(message);
  }
}

/* ================= REGISTER OTP ================= */
function* verifyRegisterOtpSaga(action: any): any {
  try {
    yield call(authService.verifyRegisterOtp, action.payload);
    yield put(verifyRegisterOtpSuccess());
    toast.success("Verifikasi berhasil, silakan login");
  } catch (err: any) {
    const message = err.response?.data?.message || "OTP tidak valid";
    yield put(verifyRegisterOtpFailure(message));
    toast.error(message);
  }
}

/* ================= LOGOUT ================= */
function* logoutSaga(): any {
  try {
    yield call([authService, authService.logout]);
  } catch (err) {
    console.log(err);
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Berhasil logout");
  }
}
/* ================= WATCHER ================= */
export default function* watchAuth() {
  yield takeLatest(loginRequest.type, loginSaga);
  yield takeLatest(verifyLoginOtpRequest.type, verifyLoginOtpSaga);
  yield takeLatest(logout.type, logoutSaga);

  yield takeLatest(registerRequest.type, registerSaga);
  yield takeLatest(verifyRegisterOtpRequest.type, verifyRegisterOtpSaga);
}
