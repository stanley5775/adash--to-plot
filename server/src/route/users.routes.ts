import { Hono } from "hono";
import {
  getAllProperties,
  getPropertyById,
  createApplication,
  verifyApplicationPayment,
  checkApplication,
} from "../controllers/users";
import { requireAuth } from "../middleware/authMiddleware";

const users = new Hono();
users.get("/properties", requireAuth, getAllProperties);
users.get("/properties/:propertyId", requireAuth, getPropertyById);
users.post("/create_application", requireAuth, createApplication);
users.post("/verify", requireAuth, verifyApplicationPayment);
users.get("/check-application", requireAuth, checkApplication);

export default users;
