/**
 * Authenticated user as returned by `/me` and used across UI state.
 * Note: this is intentionally distinct from auth-flow payloads (login,
 * register, OTP) — those live in `features/auth/auth.types.ts`.
 */
export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  is_active: boolean;
  is_admin: boolean;
  created_at: string | Date;
}
