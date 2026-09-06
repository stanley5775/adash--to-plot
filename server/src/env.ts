import { z } from "zod";
import "dotenv/config";

export const envSchema = z.object({
  DATABASE_URL: z.string(),

  JWT_SECRET: z.string().min(32),

  JWT_EXPIRES_IN: z.string(),

  FRONTEND_URL: z.string(),
  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
 

  SELAR_API_KEY: z.string().optional(),
  SELAR_WEBHOOK_SECRET: z.string().optional(),

  WHATSAPP_NUMBER: z.string().regex(/^\d+$/),
});

export const env = envSchema.parse(process.env);
