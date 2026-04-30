import { RootState } from "@/store/store";
import { AreaOption } from "./area.type";

export const selectAreasLoading = (state: RootState) => state.areas.loading;
export const selectAreasError = (state: RootState) => state.areas.error;

export const selectAreaOptions = (state: RootState): AreaOption[] =>
  state.areas?.areas?.map((area) => ({
    value: area.id,
    label: area.name,
    area,
  })) ?? [];
