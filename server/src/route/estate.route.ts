import { Hono } from "hono";
import {
  getPropertyById,
  getAllEstates,
  getPropertiesByEstate,
  getAllActiveProperties,
  getPublicStats,
} from "../controllers/estates";

const estate = new Hono();

estate.get("/properties/:propertyId", getPropertyById);

estate.get("/active", getAllActiveProperties);
estate.get("/", getAllEstates);
estate.get("/:estateId/properties", getPropertiesByEstate);
estate.get("/public/stats", getPublicStats);

export default estate;
