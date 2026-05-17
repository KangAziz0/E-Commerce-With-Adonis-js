import axios, { AxiosError, type AxiosInstance } from "axios";
import { env } from "@/config/env";

const PUBLIC_PATHS = ["/login", "/register"];
const ME_ENDPOINT = "/me";

const isOnPublicPath = (): boolean =>
  PUBLIC_PATHS.some((path) => window.location.pathname.startsWith(path));

const httpClient: AxiosInstance = axios.create({
  baseURL: env.apiUrl,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const isUnauthorized = error.response?.status === 401;
    const url = error.config?.url ?? "";
    const isMeEndpoint = url.includes(ME_ENDPOINT);

    // Redirect on 401 except for the silent /me probe and when already on a
    // public auth path (avoids redirect loops).
    if (isUnauthorized && !isMeEndpoint && !isOnPublicPath()) {
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default httpClient;
