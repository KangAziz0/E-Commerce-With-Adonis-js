export interface Auth {
  id: number;
  name: string;
  email: string;
  password: string;
  otp: number | string;
  is_active: boolean;
  is_admin: boolean;
  avatar: string;
  created_at: Date;
}
