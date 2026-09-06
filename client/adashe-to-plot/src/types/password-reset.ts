export interface ForgotPasswordInput {
  email: string;
}

export interface ForgotPasswordResult {
  success: boolean;
  message?: string;
  error?: string;
}

export interface VerifyResetOtpInput {
  email: string;
  otp: string;
}

export interface VerifyResetOtpResult {
  success: boolean;
  message?: string;
  resetToken?: string;
  error?: string;
}

export interface ResetPasswordInput {
  resetToken: string;
  password: string;
}

export interface ResetPasswordResult {
  success: boolean;
  message?: string;
  error?: string;
}
