import type { Context, Next } from "hono";
import { sign, verify } from "hono/jwt";
import { getCookie } from "hono/cookie";
import { and, eq } from "drizzle-orm";

import { env } from "../env";
import { db } from "../db/db";
import { sessions, users } from "../db/schema";

import {
  clearAuthCookies,
  setAuthCookies,
  FIFTEEN_MINUTES_SECONDS,
} from "../utils/cookies";

export async function requireAuth(c: Context, next: Next) {
  try {
    const accessToken = getCookie(c, "accessToken");
    const refreshToken = getCookie(c, "refreshToken");

    console.log("AUTH DEBUG");
    console.log("accessToken exists:", !!accessToken);
    console.log("refreshToken exists:", !!refreshToken);

    // 1. Access token
    if (accessToken) {
      try {
        const payload = await verify(
          accessToken,
          env.JWT_ACCESS_SECRET,
          "HS256",
        );

        const userId = payload.id as string;
        const role = payload.role as string;

        if (!userId || !role) {
          return clearAuthCookies(c);
        }

        c.set("userId", {
          id: userId,
          role,
        });

        return next();
      } catch {
        console.log("Access token expired/invalid");
      }
    }

    // 2. Refresh token
    if (!refreshToken) {
      return clearAuthCookies(c);
    }

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

    // 3. Check session
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

    if (session.expiresAt < new Date()) {
      console.log("Refresh token expired in database");
      return clearAuthCookies(c);
    }

    // 4. Get current user
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        full_name: users.full_name,
        role: users.role,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      return clearAuthCookies(c);
    }

    // 5. Create new access token
    const newAccessToken = await sign(
      {
        id: user.id,
        role: user.role,
        exp: Math.floor(Date.now() / 1000) + FIFTEEN_MINUTES_SECONDS,
      },
      env.JWT_ACCESS_SECRET,
    );

    // 6. Set new access token
    setAuthCookies(c, newAccessToken, refreshToken);

    c.set("userId", {
      id: user.id,
      role: user.role,
    });

    return next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return clearAuthCookies(c);
  }
}
