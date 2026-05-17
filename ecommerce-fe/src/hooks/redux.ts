import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";

/**
 * Pre-typed redux hooks. Prefer these over the raw `useDispatch` /
 * `useSelector` to get full type-safety without manually annotating
 * `RootState` at every call site.
 */
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
