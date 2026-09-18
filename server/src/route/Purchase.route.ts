import { Hono } from "hono";

import {
  submitPropertyPaymentReceipt,
  createPropertyPurchase,
  getMyPropertyPurchase,
} from "../controllers/Purchase.logic";
import { requireAuth } from "../middleware/authMiddleware";
import { authorize } from "../middleware/rolemiddleware";
import { rateLimiter } from "../middleware/rateLimiter";

const propertyPaymentRoutes = new Hono();
propertyPaymentRoutes.use("*", requireAuth);
propertyPaymentRoutes.use("*", authorize("CUSTOMER"));
propertyPaymentRoutes.post(
  "/receipt",

  rateLimiter(15 * 60 * 1000, 10),
  submitPropertyPaymentReceipt,
);
propertyPaymentRoutes.post(
  "/property-purchase",
  rateLimiter(15 * 60 * 1000, 10),
  createPropertyPurchase,
);

propertyPaymentRoutes.get(
  "/properties/:propertyId/purchase",
  requireAuth,
  getMyPropertyPurchase,
);
export default propertyPaymentRoutes;
