const api = process.env.NEXT_PUBLIC_BACKEND;
export interface RegisterPayload {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
}
export interface LoginPayload {
  email: string;
  password: string;
}
export const registerUser = async (data: RegisterPayload) => {
  const res = await fetch(`${api}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const result = await res.json();

  console.log(result, "from register");

  if (!res.ok) {
    throw new Error(result.message || "Registration failed");
  }

  return result.data;
};

export const loginUser = async (data: LoginPayload) => {
  const res = await fetch(`${api}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  const result = await res.json();
  console.log(result, "from login");
  if (!res.ok) {
    throw new Error(result.message || "Login failed");
  }
  return result.data;
};

export interface ForgotPasswordPayload {
  email: string;
}

export const forgotPassword = async (data: ForgotPasswordPayload) => {
  const res = await fetch(`${api}/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to send reset email");
  }

  return result;
};

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export const verifyOtp = async (data: VerifyOtpPayload) => {
  const res = await fetch(`${api}/auth/verify-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const result = await res.json();

  console.log(result, "from verify otp");

  if (!res.ok) {
    throw new Error(result.message || "Invalid OTP");
  }

  return result;
};

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

export const resetPassword = async (data: ResetPasswordPayload) => {
  const res = await fetch(`${api}/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const result = await res.json();

  console.log(result, "from reset password");

  if (!res.ok) {
    throw new Error(result.message || "Unable to reset password");
  }

  return result;
};

export const logoutUser = async () => {
  const res = await fetch(`${api}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Logout failed");
  }

  return result;
};
