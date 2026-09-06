import { z } from "zod";
export const createEstateSchema = z.object({
  estateNameId: z.string().uuid("Invalid estate name ID"),
  location: z.string().trim().min(1, "Location is required"),
  city: z.string().trim().min(1, "City is required"),
  state: z.string().trim().min(1, "State is required"),
  description: z.string().trim().optional().nullable(),
  startingPrice: z.coerce
    .number()
    .positive("Starting price must be greater than 0"),
  totalPlots: z.coerce
    .number()
    .int("Total plots must be a whole number")
    .positive("Total plots must be greater than 0"),
  features: z.string().optional().default(""),
  nearbyLandmarks: z.string().optional().default(""),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});
