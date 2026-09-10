import { z } from "zod";

const paymentPlanSchema = z.object({
  name: z.enum(["6 Months", "12 Months", "18 Months", "24 Months"]),

  durationMonths: z.number().int().positive(),
});

export const createPropertyPaymentPlansSchema = z.object({
  plans: z
    .array(paymentPlanSchema)
    .min(1, "At least one payment plan is required"),
});
