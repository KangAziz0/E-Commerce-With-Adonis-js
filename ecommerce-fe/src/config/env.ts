/**
 * Centralized, typed access to Vite environment variables.
 *
 * Why centralize?
 * - Avoid scattering `import.meta.env.VITE_*` magic strings across the app.
 * - Coerce values once (env vars are always strings, no auto-conversion).
 * - Provide safe defaults and a single place to document required variables.
 */

const readString = (key: string, fallback = ""): string => {
  const raw = import.meta.env[key as keyof ImportMetaEnv];
  return typeof raw === "string" && raw.length > 0 ? raw : fallback;
};

const readBoolean = (key: string, fallback = false): boolean => {
  const raw = import.meta.env[key as keyof ImportMetaEnv];
  if (typeof raw !== "string") return fallback;
  return raw.toLowerCase() === "true" || raw === "1";
};

export const env = {
  apiUrl: readString("VITE_API_URL", "http://localhost:3333/api"),
  backendUrl: readString("VITE_BACKEND_URL", "http://localhost:3333"),
  /**
   * When true, login/register flow expects an OTP step before completion.
   * Backed by `VITE_OTP_SENT` (string) — coerced to boolean here.
   */
  otpEnabled: readBoolean("VITE_OTP_SENT", false),
  /**
   * Default origin area id used by the shipping-rates API.
   */
  originAreaId: readString("VITE_ORIGIN_AREA_ID", ""),
} as const;

export type AppEnv = typeof env;
