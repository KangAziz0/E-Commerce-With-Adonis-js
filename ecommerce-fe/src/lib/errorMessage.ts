import { AxiosError } from "axios";

interface ApiErrorBody {
  message?: string;
  errors?: Array<{ message?: string }>;
}

/**
 * Extracts a human-readable error message from an API/network error.
 * Falls back to the provided default when nothing useful is available.
 */
export const getErrorMessage = (
  error: unknown,
  fallback = "Terjadi kesalahan, coba lagi nanti",
): string => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorBody | undefined;
    return (
      data?.errors?.[0]?.message ?? data?.message ?? error.message ?? fallback
    );
  }
  if (error instanceof Error) return error.message || fallback;
  return fallback;
};
