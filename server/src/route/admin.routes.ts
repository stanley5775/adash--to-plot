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
  getPropertyPaymentPlans,
  deletePropertyPaymentPlan,
  getAllPropertyPaymentVerifications,
  approvePropertyPayment,
  rejectPropertyPayment,
} from "../controllers/admin.Controller";

import { requireAuth } from "../middleware/authMiddleware";
import { authorize } from "../middleware/rolemiddleware";

const admin = new Hono();

admin.use("*", requireAuth);

admin.post("/create-estate", createEstate);

admin.get("/", authorize("ADMIN", "CUSTOMER"), getAllEstates);
admin.post("/create-estatename", authorize("ADMIN"), createEstateName);
admin.post(
  "/:propertyId/payment-plans",
  authorize("ADMIN"),
  createPropertyPaymentPlans,
);
admin.get("/properties", authorize("ADMIN"), getAllProperties);
admin.delete("/properties/:propertyId", authorize("ADMIN"), deleteProperty);
admin.delete("/estate-name/:estateId", authorize("ADMIN"), deleteEstateName);
admin.put("/properties/:propertyId", authorize("ADMIN"), updateProperty);
admin.put("/estate-name/:estateId", authorize("ADMIN"), updateEstateName);
admin.put("/users/:userId/status", authorize("ADMIN"), toggleUserStatus);
admin.get("/users", getAllUsers);
admin.get("/ati-members", getAllATIMembers);
admin.patch("/ati-members/:userId/toggle", toggleUserATI);
admin.get("/applicants", getAllApplicants);
admin.get("/:propertyId/payment-plans", getPropertyPaymentPlans);
admin.delete("/payment-plans/:planId", deletePropertyPaymentPlan);

admin.get(
  "/verifications",

  getAllPropertyPaymentVerifications,
);

admin.patch(
  "/verifications/:verificationId/approve",

  approvePropertyPayment,
);

admin.patch(
  "/verifications/:verificationId/reject",

  rejectPropertyPayment,
);

export default admin;
