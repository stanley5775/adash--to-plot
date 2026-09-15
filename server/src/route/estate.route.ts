import { Hono } from "hono";
import {
  //   getAllProperties,
  getPropertyById,
  //   getPropertyFilters,
  getAllEstates,
  getPropertiesByEstate,
  getAllActiveProperties,
} from "../controllers/estates";

const estate = new Hono();

estate.get("/properties/:propertyId", getPropertyById);

estate.get("/active", getAllActiveProperties);
estate.get("/", getAllEstates);
estate.get("/:estateId/properties", getPropertiesByEstate);
export default estate;
