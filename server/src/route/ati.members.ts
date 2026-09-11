import { Hono } from "hono";

import {
  createAtiMembership,
  verifyAtiMembershipPayment,
  checkAtiMembership,
} from "../controllers/ati.member";
import { requireAuth } from "../middleware/authMiddleware";

createAtiMembership;
const ati = new Hono();

ati.post("/membership", requireAuth, createAtiMembership);

ati.post("/membership/verify", requireAuth, verifyAtiMembershipPayment);

ati.get("/membership/check", requireAuth, checkAtiMembership);

export default ati;
