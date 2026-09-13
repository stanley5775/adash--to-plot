import { Hono } from "hono";
import {
  getAllProperties,
  getPropertyById,
  getPropertyFilters,
} from "../controllers/estates";

const estate = new Hono();
estate.get("/properties", getAllProperties);

estate.get("/properties/:propertyId", getPropertyById);
estate.get("/property-filters", getPropertyFilters);
export default estate;
