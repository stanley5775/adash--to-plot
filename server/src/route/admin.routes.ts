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
  getAllATIMembers,
  toggleUserATI,
  getAllApplicants,
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
admin.get("/ati-members", getAllATIMembers);
admin.patch("/ati-members/:userId/toggle", toggleUserATI);
admin.get("/applicants", getAllApplicants);
export default admin;
