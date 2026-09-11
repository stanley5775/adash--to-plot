import { z } from "zod";
export const createEstateNameSchema = z.object({
  name: z.string().trim().min(1, "Estate name is required"),
  accountName: z.string().trim().min(1, "Account name is required"),
  bankName: z.string().trim().min(1, "bank  name is required"),
  accountNumber: z
    .string()
    .trim()
    .min(1, "Account number is required")
    .regex(/^\d{10}$/, "Account number must be exactly 10 digits"),
});
