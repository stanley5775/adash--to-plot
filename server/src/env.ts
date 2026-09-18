import { z } from "zod";
import "dotenv/config";

export const envSchema = z.object({
  DATABASE_URL: z.string(),

  JWT_SECRET: z.string().min(32),
  COMPANY_START_YEAR: z.coerce.number(),
  JWT_EXPIRES_IN: z.string(),
  UPSTASH_REDIS_REST_URL: z.string().url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
  FRONTEND_URL: z.string(),
  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  RESEND_API_KEY: z.string(),
  PAYSTACK_SECRET_KEY: z.string(),

  WHATSAPP_NUMBER: z.string().regex(/^\d+$/),
});

export const env = envSchema.parse(process.env);
