import { Hono } from "hono";
import {
  createApplication,
  verifyApplicationPayment,
  checkApplication,
  getMe,
} from "../controllers/users";
import { requireAuth } from "../middleware/authMiddleware";
import { authorize } from "../middleware/rolemiddleware";

const users = new Hono();

users.use("*", requireAuth);

users.post("/create_application", authorize("CUSTOMER"), createApplication);

users.post("/verify", authorize("CUSTOMER"), verifyApplicationPayment);

users.get("/check-application", authorize("CUSTOMER"), checkApplication);

// CUSTOMER + ADMIN
users.get("/me", authorize("CUSTOMER", "ADMIN"), getMe);
export default users;
