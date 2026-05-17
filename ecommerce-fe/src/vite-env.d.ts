/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_BACKEND_URL: string;
  readonly VITE_OTP_SENT: string;
  readonly VITE_ORIGIN_AREA_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
