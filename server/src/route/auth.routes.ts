import { Hono } from "hono";

import {
  register,
  login,
  logout,
  forgotPassword,
  verifyOtp,
  resetPasswordController,
} from "../controllers/auth.controller";

const authRoutes = new Hono();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/logout", logout);
authRoutes.post("/forgot-password", forgotPassword);
authRoutes.post("/verify-otp", verifyOtp);
authRoutes.post("/reset-password", resetPasswordController);

export default authRoutes;
