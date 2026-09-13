import { Hono } from "hono";
import {
  getAllProperties,
  getPropertyById,
  getPropertyFilters,
  getAllEstates,
} from "../controllers/estates";

const estate = new Hono();
estate.get("/properties", getAllProperties);

estate.get("/properties/:propertyId", getPropertyById);
estate.get("/property-filters", getPropertyFilters);
estate.get("/", getAllEstates);
export default estate;
