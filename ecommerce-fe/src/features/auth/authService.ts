import api from "../../api";
import { Auth } from "../../types/Auth";

const authService = {
  register: (data: Auth) => api.post("/register", data),
  me: () => api.get("/me"),
  verifyLoginOtp: (data: Auth) => api.post("/verify-login", data),
  login: (data: Auth) => api.post("/login", data),
  verifyRegisterOtp: (data: Auth) => api.post("/verify-email", data),
  logout: () => api.post("/logout"),
};

export default authService;
