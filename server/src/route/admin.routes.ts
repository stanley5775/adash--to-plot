import { Hono } from "hono";
import {
  createEstate,
  createEstateName,
  getAllEstates,
} from "../controllers/admin.Controller";

import { requireAuth } from "../middleware/authMiddleware";

const admin = new Hono();

admin.post("/create-estate", createEstate);
admin.get("/", getAllEstates);
admin.post("/create-estatename", createEstateName);
export default admin;
