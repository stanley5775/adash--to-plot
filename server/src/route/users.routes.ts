import { Hono } from "hono";
import {
  getAllProperties,
  getPropertyById,
  createApplication,
  verifyApplicationPayment,
  checkApplication,
} from "../controllers/users";

const users = new Hono();
users.get("/properties", getAllProperties);
users.get("/properties/:propertyId", getPropertyById);
users.post("/create_application", createApplication);
users.post("/verify", verifyApplicationPayment);
users.get("/check_application", checkApplication);

export default users;
