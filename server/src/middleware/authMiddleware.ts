import type { Context, Next } from "hono";
import { sign, verify } from "hono/jwt";
import { getCookie, setCookie } from "hono/cookie";
import { and, eq } from "drizzle-orm";
import { env } from "../env";

import { db } from "../db/db";
import { sessions } from "../db/schema";
import {
  clearAuthCookies,
  FIFTEEN_MINUTES_SECONDS,
  setAuthCookies,
} from "../utils/cookies";

const isProduction = process.env.NODE_ENV === "production";

export async function requireAuth(c: Context, next: Next) {
  try {
    const accessToken = getCookie(c, "accessToken");

    //  1. Try access token if it exists

    if (accessToken) {
      try {
        const payload = await verify(
          accessToken,
          env.JWT_ACCESS_SECRET,
          "HS256",
        );

        const userId = payload.id as string;

        if (!userId) {
          return clearAuthCookies(c);
        }

        c.set("userId", userId);
        await next();
      } catch {
        console.log("Access token expired/invalid. Trying refresh token...");
      }
    }

    //  2. Access token is missing or expired.
    //    Try refresh token.

    const refreshToken = getCookie(c, "refreshToken");

    if (!refreshToken) {
      return clearAuthCookies(c);
    }

    //  3. Verify refresh token

    let refreshPayload;

    try {
      refreshPayload = await verify(
        refreshToken,
        env.JWT_REFRESH_SECRET,
        "HS256",
      );
    } catch {
      console.log("Refresh token expired/invalid");

      return clearAuthCookies(c);
    }

    const userId = refreshPayload.id as string;

    if (!userId) {
      return clearAuthCookies(c);
    }

    // 4. Check refresh token against database

    const [session] = await db
      .select()
      .from(sessions)
      .where(
        and(
          eq(sessions.refreshToken, refreshToken),
          eq(sessions.userId, userId),
        ),
      )
      .limit(1);

    if (!session) {
      console.log("Refresh token not found in database");

      return clearAuthCookies(c);
    }

    //  5. Check database expiration

    if (session.expiresAt < new Date()) {
      console.log("Refresh token expired in database");

      return clearAuthCookies(c);
    }

    // 6. Create new access token

    const newAccessToken = await sign(
      {
        id: userId,
        exp: Math.floor(Date.now() / 1000) + FIFTEEN_MINUTES_SECONDS,
      },
      env.JWT_ACCESS_SECRET,
    );

    // 7. Replace access token cookie

    setCookie(c, "accessToken", newAccessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "None",

      path: "/",
      maxAge: FIFTEEN_MINUTES_SECONDS,
    });

    // 8. Authenticate the request

    c.set("userId", userId);

    //  9. Continue original request

    return next();
  } catch (error) {
    console.error("Auth middleware error:", error);

    return clearAuthCookies(c);
  }
}
