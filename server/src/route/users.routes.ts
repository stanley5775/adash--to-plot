import { Hono } from "hono";
import {
  createApplication,
  verifyApplicationPayment,
  checkApplication,
  getMe,
  getUserDashboard,
  getMyProperties,
  getMyPaymentHistory,
  getMyApplicationHistory,
  getMyApplicationById,
} from "../controllers/users";
import { requireAuth } from "../middleware/authMiddleware";
import { authorize } from "../middleware/rolemiddleware";

const users = new Hono();

users.use("*", requireAuth);

users.post("/create_application", authorize("CUSTOMER"), createApplication);

users.post("/verify", authorize("CUSTOMER"), verifyApplicationPayment);

users.get("/check-application", checkApplication);
users.get("/dashboard", getUserDashboard);
users.get("/properties", authorize("CUSTOMER"), getMyProperties);
users.get("/history", authorize("CUSTOMER"), getMyPaymentHistory);
users.get(
  "/applications-history",
  authorize("CUSTOMER"),
  getMyApplicationHistory,
);

// CUSTOMER + ADMIN
users.get("/me", authorize("CUSTOMER", "ADMIN"), getMe);
users.get("/applications/:applicationId", requireAuth, getMyApplicationById);
export default users;
