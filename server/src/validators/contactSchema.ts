import { z } from "zod";
export const contactSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name is too long"),

  phoneNumber: z
    .string()
    .min(7, "Phone number is invalid")
    .max(20, "Phone number is too long"),

  email: z.string().email("Please provide a valid email address"),

  message: z
    .string()
    .min(5, "Message must be at least 5 characters")
    .max(2000, "Message is too long"),
});
