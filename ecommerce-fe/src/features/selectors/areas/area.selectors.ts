import type { RootState } from "@/store/store";
import type { AreaOption } from "./area.types";

export const selectAreasLoading = (state: RootState) => state.areas.loading;
export const selectAreasError = (state: RootState) => state.areas.error;

export const selectAreaOptions = (state: RootState): AreaOption[] =>
  state.areas?.areas?.map((area) => ({
    value: area.id,
    label: area.name,
    area,
  })) ?? [];
