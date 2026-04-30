import { call, put, takeLatest, delay } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Area, GetAreasParams } from "./area.type";
import {
  fetchAreasFailure,
  fetchAreasRequest,
  fetchAreasSuccess,
} from "./areaSlice";
import areaService from "./areaService";

interface AreasApiResponse {
  success: boolean;
  data: Area[];
}

function* handleFetchAreas(action: PayloadAction<GetAreasParams>) {
  try {
    // debounce 500ms — tunggu user selesai mengetik
    yield delay(500);

    const response: AreasApiResponse = yield call(
      areaService.getAreas,
      action.payload,
    );

    yield put(fetchAreasSuccess(response.data));
  } catch (err: any) {
    const message = err.response?.data?.message ?? "Gagal memuat area";
    yield put(fetchAreasFailure(message));
  }
}

export default function* areasSaga() {
  yield takeLatest(fetchAreasRequest.type, handleFetchAreas);
}
