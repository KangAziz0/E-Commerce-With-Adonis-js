import api from "../../api";
import { Auth, ResendOtp } from "../../types/Auth";

const authService = {
  register: (data: Auth) => api.post("/register", data),
  login: (data: Auth) => api.post("/login", data),
  resendOtp: (data: ResendOtp) => api.post("/resendOtp", data),
  verifyLoginOtp: (data: Auth) => api.post("/verify-login", data),
  verifyRegisterOtp: (data: Auth) => api.post("/verify-email", data),
  me: () => api.get("/me"),
  logout: () => api.post("/logout"),
};

export default authService;
