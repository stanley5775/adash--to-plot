import { z } from "zod";
export const createEstateNameSchema = z.object({
  name: z.string().trim().min(1, "Estate name is required"),
  accountName: z.string().trim().min(1, "Account name is required"),
  bankName: z.string().trim().min(1, "bank  name is required"),
  description: z.string().min(10, "Estate description is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),

  startingPrice: z.string().min(1, "Starting price is required"),
  accountNumber: z
    .string()
    .trim()
    .min(1, "Account number is required")
    .regex(/^\d{10}$/, "Account number must be exactly 10 digits"),
});
