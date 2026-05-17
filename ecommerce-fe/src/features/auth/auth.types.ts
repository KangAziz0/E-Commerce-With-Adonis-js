/**
 * Auth-flow request/response payloads.
 * These intentionally stay separate from the domain `User` model because
 * they describe wire payloads (which include OTP, password, etc.).
 */

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface ResendOtpPayload {
  email: string;
  purpose: string;
}

export type OtpPurpose = "login" | "register";
