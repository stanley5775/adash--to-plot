import { Hono } from "hono";

import {
  submitPropertyPaymentReceipt,
  createPropertyPurchase,
  getMyPropertyPurchase,
} from "../controllers/Purchase.logic";
import { requireAuth } from "../middleware/authMiddleware";
import { authorize } from "../middleware/rolemiddleware";
const propertyPaymentRoutes = new Hono();
propertyPaymentRoutes.use("*", requireAuth);
propertyPaymentRoutes.use("*", authorize("CUSTOMER"));
propertyPaymentRoutes.post(
  "/receipt",
  requireAuth,
  submitPropertyPaymentReceipt,
);
propertyPaymentRoutes.post(
  "/property-purchase",
  requireAuth,
  createPropertyPurchase,
);

propertyPaymentRoutes.get(
  "/properties/:propertyId/purchase",
  requireAuth,
  getMyPropertyPurchase,
);
export default propertyPaymentRoutes;
