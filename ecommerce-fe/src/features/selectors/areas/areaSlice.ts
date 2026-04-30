import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Area, GetAreasParams } from "./area.type";

interface AreasState {
  areas: Area[];
  loading: boolean;
  error: string | null;
}

const initialState: AreasState = {
  areas: [],
  loading: false,
  error: null,
};

const areasSlice = createSlice({
  name: "areas",
  initialState,
  reducers: {
    fetchAreasRequest(state, _action: PayloadAction<GetAreasParams>) {
      state.loading = true;
      state.error = null;
    },
    fetchAreasSuccess(state, action: PayloadAction<Area[]>) {
      state.loading = false;
      state.areas = action.payload;
    },
    fetchAreasFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    clearAreas(state) {
      state.areas = [];
      state.error = null;
    },
  },
});

export const {
  fetchAreasRequest,
  fetchAreasSuccess,
  fetchAreasFailure,
  clearAreas,
} = areasSlice.actions;

export default areasSlice.reducer;
