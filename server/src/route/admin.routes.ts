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
  getAdminDashboardStats,
} from "../controllers/admin.Controller";

import { requireAuth } from "../middleware/authMiddleware";
import { authorize } from "../middleware/rolemiddleware";
import { rateLimiter } from "../middleware/rateLimiter";

const admin = new Hono();

admin.use("*", requireAuth);

admin.post(
  "/create-estate",
  authorize("ADMIN"),
  rateLimiter(15 * 60 * 1000, 20),
  createEstate,
);

admin.get("/", authorize("ADMIN", "CUSTOMER"), getAllEstates);
admin.post(
  "/create-estatename",
  rateLimiter(15 * 60 * 1000, 20),
  authorize("ADMIN"),
  createEstateName,
);
admin.post(
  "/:propertyId/payment-plans",
  authorize("ADMIN"),
  rateLimiter(15 * 60 * 1000, 20),
  createPropertyPaymentPlans,
);
admin.get("/properties", authorize("ADMIN"), getAllProperties);
admin.delete("/properties/:propertyId", authorize("ADMIN"), deleteProperty);
admin.delete(
  "/estate-name/:estateId",
  authorize("ADMIN"),
  rateLimiter(15 * 60 * 1000, 20),
  deleteEstateName,
);
admin.put(
  "/properties/:propertyId",
  authorize("ADMIN"),
  rateLimiter(15 * 60 * 1000, 30),
  updateProperty,
);
admin.put(
  "/estate-name/:estateId",
  authorize("ADMIN"),
  rateLimiter(15 * 60 * 1000, 30),
  updateEstateName,
);
admin.put(
  "/users/:userId/status",
  authorize("ADMIN"),
  rateLimiter(15 * 60 * 1000, 20),
  toggleUserStatus,
);
admin.get("/users", authorize("ADMIN"), getAllUsers);
admin.get("/ati-members", authorize("ADMIN"), getAllATIMembers);
admin.patch(
  "/ati-members/:userId/toggle",
  authorize("ADMIN"),
  rateLimiter(15 * 60 * 1000, 20),
  toggleUserATI,
);
admin.get("/applicants", getAllApplicants);
admin.get(
  "/:propertyId/payment-plans",
  authorize("ADMIN"),
  getPropertyPaymentPlans,
);
admin.delete(
  "/payment-plans/:planId",
  authorize("ADMIN"),
  rateLimiter(15 * 60 * 1000, 20),
  deletePropertyPaymentPlan,
);

admin.get(
  "/verifications",
  authorize("ADMIN"),
  getAllPropertyPaymentVerifications,
);

admin.patch(
  "/verifications/:verificationId/approve",
  authorize("ADMIN"),
  rateLimiter(15 * 60 * 1000, 30),
  approvePropertyPayment,
);

admin.patch(
  "/verifications/:verificationId/reject",
  authorize("ADMIN"),
  rateLimiter(15 * 60 * 1000, 30),
  rejectPropertyPayment,
);
admin.get("/dashboard", authorize("ADMIN"), getAdminDashboardStats);
export default admin;
