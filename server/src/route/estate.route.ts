import { Hono } from "hono";
import {
  getAllProperties,
  getPropertyById,
  getPropertyFilters,
  getAllEstates,
  getPropertiesByEstate,
  getAllActiveProperties,
} from "../controllers/estates";

const estate = new Hono();
estate.get("/properties", getAllProperties);

estate.get("/properties/:propertyId", getPropertyById);
estate.get("/property-filters", getPropertyFilters);
estate.get("/active", getAllActiveProperties);
estate.get("/", getAllEstates);
estate.get("/:estateId/properties", getPropertiesByEstate);
export default estate;
