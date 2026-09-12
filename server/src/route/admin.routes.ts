import { Hono } from "hono";

import {
  createEstate,
  createEstateName,
  createPropertyPaymentPlans,
  getAllEstates,
  getAllProperties,
  deleteProperty,
  deleteEstateName,
  updateProperty,
  updateEstateName,
  toggleUserStatus,
  getAllUsers,
} from "../controllers/admin.Controller";

import { requireAuth } from "../middleware/authMiddleware";
import { authorize } from "../middleware/rolemiddleware";

const admin = new Hono();

admin.use("*", requireAuth);
admin.use("*", authorize("ADMIN"));

admin.post("/create-estate", createEstate);

admin.get("/", getAllEstates);
admin.post("/create-estatename", createEstateName);
admin.post("/:propertyId/payment-plans", createPropertyPaymentPlans);
admin.get("/properties", getAllProperties);
admin.delete("/properties/:propertyId", deleteProperty);
admin.delete("/estate-name/:estateId", deleteEstateName);
admin.put("/properties/:propertyId", updateProperty);
admin.put("/estate-name/:estateId", updateEstateName);
admin.put("/users/:userId/status", toggleUserStatus);
admin.get("/users", getAllUsers);
export default admin;
