export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  role: "admin" | "superadmin";
}

export interface AdminLoginInput {
  email: string;
  password: string;
}

export interface AdminAuthResult {
  success: boolean;
  admin?: AdminUser;
  error?: string;
}
