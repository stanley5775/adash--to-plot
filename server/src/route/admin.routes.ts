import { Hono } from "hono";

import {
  createEstate,
  createEstateName,
  createPropertyPaymentPlans,
  getAllEstates,
} from "../controllers/admin.Controller";

import { requireAuth } from "../middleware/authMiddleware";
import { authorize } from "../middleware/rolemiddleware";

const admin = new Hono();

// All routes below require authentication + ADMIN role
admin.use("*", requireAuth);
admin.use("*", authorize("ADMIN"));

admin.post("/create-estate", createEstate);

admin.get("/", getAllEstates);

admin.post("/create-estatename", createEstateName);

admin.post("/:propertyId/payment-plans", createPropertyPaymentPlans);

export default admin;
