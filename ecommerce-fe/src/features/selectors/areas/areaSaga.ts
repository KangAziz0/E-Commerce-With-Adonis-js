import type { PayloadAction } from "@reduxjs/toolkit";
import type { SagaIterator } from "redux-saga";
import { call, delay, put, takeLatest } from "redux-saga/effects";

import { getErrorMessage } from "@/lib/errorMessage";
import areaService from "./areaService";
import type { Area, GetAreasParams } from "./area.types";
import {
  fetchAreasFailure,
  fetchAreasRequest,
  fetchAreasSuccess,
} from "./areaSlice";

interface AreasApiResponse {
  success: boolean;
  data: Area[];
}

const SEARCH_DEBOUNCE_MS = 500;

function* handleFetchAreas(
  action: PayloadAction<GetAreasParams>,
): SagaIterator {
  try {
    // Debounce: wait until the user stops typing.
    yield delay(SEARCH_DEBOUNCE_MS);

    const response: AreasApiResponse = yield call(
      areaService.getAreas,
      action.payload,
    );

    yield put(fetchAreasSuccess(response.data));
  } catch (error) {
    yield put(fetchAreasFailure(getErrorMessage(error, "Gagal memuat area")));
  }
}

export default function* watchAreas() {
  yield takeLatest(fetchAreasRequest.type, handleFetchAreas);
}
