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
import { rateLimiter } from "../middleware/rateLimiter";

const authRoutes = new Hono();

authRoutes.post("/register", rateLimiter(15 * 60 * 1000, 5), register);
authRoutes.post("/login", rateLimiter(15 * 60 * 1000, 10), login);

authRoutes.post(
  "/forgot-password",

  forgotPassword,
);
authRoutes.post("/verify-otp", rateLimiter(15 * 60 * 1000, 10), verifyOtp);
authRoutes.post("/logout", requireAuth, authorize("CUSTOMER", "ADMIN"), logout);
authRoutes.post(
  "/reset-password",
  rateLimiter(15 * 60 * 1000, 5),
  resetPasswordController,
);

export default authRoutes;
