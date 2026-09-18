import crypto from "crypto";
import type { Context, Next } from "hono";
import { redis } from "../utils/redis";

export const rateLimiter = (windowMs: number, maxReq: number) => {
  return async (c: Context, next: Next) => {
    try {
      const userAgent = c.req.header("User-Agent") || "unknown";

      const ip =
        c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ||
        c.req.header("cf-connecting-ip") ||
        c.req.header("x-real-ip") ||
        "unknown";
      console.log("ip from ratelimit", ip);
      const key = crypto
        .createHash("sha256")
        .update(userAgent + ip)
        .digest("hex");

      const redisKey = `rate:${c.req.path}:${key}`;

      const now = Date.now();

      const windowStart = now - windowMs;

      const requestId = `${now}-${crypto.randomUUID()}`;

      const pipeline = redis.pipeline();

      // Add current request
      pipeline.zadd(redisKey, {
        score: now,
        member: requestId,
      });

      // Remove requests outside the current window
      pipeline.zremrangebyscore(redisKey, 0, windowStart);

      // Count requests inside the window
      pipeline.zcard(redisKey);

      // Automatically remove the key after the window
      pipeline.expire(redisKey, Math.ceil(windowMs / 1000));

      const results = await pipeline.exec();

      const reqCount = Number(results[2]);

      if (reqCount > maxReq) {
        return c.json(
          {
            success: false,
            message: "Too many requests. Please try again later.",
          },
          429,
        );
      }

      await next();
    } catch (error) {
      console.error("RATE LIMITER ERROR:", error);

      // Don't break the API if Redis temporarily fails
      await next();
    }
  };
};
