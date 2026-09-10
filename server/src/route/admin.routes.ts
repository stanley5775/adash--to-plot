import { Hono } from "hono";
import {
  createEstate,
  createEstateName,
  createPropertyPaymentPlans,
  getAllEstates,
  getAllEstatesName,
} from "../controllers/admin.Controller";

import { requireAuth } from "../middleware/authMiddleware";

const admin = new Hono();

admin.post("/create-estate", createEstate);
admin.get("/", getAllEstatesName);
admin.post("/create-estatename", createEstateName);
admin.post("/:propertyId/payment-plans", createPropertyPaymentPlans);

export default admin;
