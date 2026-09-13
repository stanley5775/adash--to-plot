import { Hono } from "hono";

import {
  register,
  login,
  forgotPassword,
  verifyOtp,
  logout,
  resetPasswordController,
} from "../controllers/auth.controller";
import { authorize } from "../middleware/rolemiddleware";
import { requireAuth } from "../middleware/authMiddleware";

const authRoutes = new Hono();

authRoutes.post("/register", register);
authRoutes.post("/login", login);

authRoutes.post("/forgot-password", forgotPassword);
authRoutes.post("/verify-otp", verifyOtp);
authRoutes.post("/logout", requireAuth, authorize("CUSTOMER", "ADMIN"), logout);
authRoutes.post("/reset-password", resetPasswordController);

export default authRoutes;
