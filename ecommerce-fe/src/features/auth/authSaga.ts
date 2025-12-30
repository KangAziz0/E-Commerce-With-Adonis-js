import { call, put, takeLatest } from "redux-saga/effects";
import { loginRequest, loginSuccess, loginFailure } from "./authSlice";
import api from "../../api";

function* loginSaga(action: any): any {
  try {
    const response = yield call(api.post, "/login", action.payload);
    yield put(loginSuccess(response.data.data));
    localStorage.setItem("token", response.data.data.token);
  } catch (err: any) {
    yield put(loginFailure(err.response?.data?.message || "Login failed"));
  }
}

export default function* watchAuth() {
  yield takeLatest(loginRequest.type, loginSaga);
}
