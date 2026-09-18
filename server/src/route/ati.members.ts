import { Hono } from "hono";

import {
  createAtiMembership,
  verifyAtiMembershipPayment,
  checkAtiMembership,
} from "../controllers/ati.member";
import { requireAuth } from "../middleware/authMiddleware";
import { rateLimiter } from "../middleware/rateLimiter";
import { authorize } from "../middleware/rolemiddleware";

const ati = new Hono();

ati.use("*", requireAuth);
ati.use("*", authorize("CUSTOMER"));
ati.post(
  "/membership",
  requireAuth,
  rateLimiter(15 * 60 * 1000, 10),
  createAtiMembership,
);

ati.post(
  "/membership/verify",
  requireAuth,
  rateLimiter(15 * 60 * 1000, 10),
  verifyAtiMembershipPayment,
);

ati.get("/membership/check", requireAuth, checkAtiMembership);

export default ati;
