export const OTP_LENGTH = 6;

/**
 * LocalStorage keys used by the auth flow.
 * Centralized to avoid string typos across components/sagas.
 */
export const AUTH_STORAGE_KEYS = {
  otpEmail: "otpEmail",
} as const;
