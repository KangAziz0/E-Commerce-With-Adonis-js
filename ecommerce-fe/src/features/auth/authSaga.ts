import { call, put, takeLatest } from "redux-saga/effects";
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  registerSuccess,
  registerFailure,
  registerRequest,
} from "./authSlice";
import api from "../../api";
import { toast } from "react-toastify";
function* loginSaga(action: any): any {
  try {
    const response = yield call(api.post, "/login", action.payload);

    yield put(loginSuccess(response.data.data));
    localStorage.setItem("token", response.data.data.token);

    toast.success("Login berhasil");
  } catch (err: any) {
    const message = err.response?.data?.message || "Login gagal";

    yield put(loginFailure(message));
    toast.error(message);
  }
}

function* registerSaga(action: any): any {
  try {
    yield call(api.post, "/register", action.payload);

    yield put(registerSuccess());
    toast.success("Registrasi berhasil, silakan login");
  } catch (error: any) {
    const message = error.response?.data?.message || "Registrasi gagal";

    yield put(registerFailure(message));
    toast.error(message);
  }
}

export default function* watchAuth() {
  yield takeLatest(loginRequest.type, loginSaga);
  yield takeLatest(registerRequest.type, registerSaga);
}
