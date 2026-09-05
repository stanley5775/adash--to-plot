export interface ForgotPasswordInput {
  email: string;
}

export interface ForgotPasswordResult {
  success: boolean;
  message?: string;
  error?: string;
}

export interface ResetPasswordInput {
  token: string;
  password: string;
}

export interface ResetPasswordResult {
  success: boolean;
  message?: string;
  error?: string;
}
