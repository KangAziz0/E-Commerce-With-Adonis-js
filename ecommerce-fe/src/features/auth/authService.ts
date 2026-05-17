import httpClient from "@/lib/httpClient";
import type {
  LoginPayload,
  RegisterPayload,
  ResendOtpPayload,
  VerifyOtpPayload,
} from "./auth.types";

const authService = {
  register: (data: RegisterPayload) => httpClient.post("/register", data),
  login: (data: LoginPayload) => httpClient.post("/login", data),
  resendOtp: (data: ResendOtpPayload) => httpClient.post("/resendOtp", data),
  verifyLoginOtp: (data: VerifyOtpPayload) =>
    httpClient.post("/verify-login", data),
  verifyRegisterOtp: (data: VerifyOtpPayload) =>
    httpClient.post("/verify-email", data),
  me: () => httpClient.get("/me"),
  logout: () => httpClient.post("/logout"),
};

export default authService;
