interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly OTP_SEND: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
