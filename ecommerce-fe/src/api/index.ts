import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error),
);

/* ================= RESPONSE INTERCEPTOR ================= */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const is401 = error.response?.status === 401;
    const isMeEndpoint = error.config?.url?.includes("/me");

    if (
      is401 &&
      !isMeEndpoint &&
      !window.location.pathname.includes("/login")
    ) {
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default api;
