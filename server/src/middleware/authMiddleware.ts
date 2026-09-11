import type { Context, Next } from "hono";
import { sign, verify } from "hono/jwt";
import { getCookie, setCookie } from "hono/cookie";
import { and, eq } from "drizzle-orm";
import { env } from "../env";

import { db } from "../db/db";
import { sessions, users } from "../db/schema";

import { clearAuthCookies, FIFTEEN_MINUTES_SECONDS } from "../utils/cookies";

const isProduction = process.env.NODE_ENV === "production";

export async function requireAuth(c: Context, next: Next) {
  try {
    const accessToken = getCookie(c, "accessToken");
    const refreshToken1 = getCookie(c, "refreshToken");

    console.log("AUTH DEBUG");
    console.log("accessToken exists:", !!accessToken);
    console.log("refreshToken exists:", !!refreshToken1);

    // 1. Try access token
    if (accessToken) {
      try {
        const payload = await verify(
          accessToken,
          env.JWT_ACCESS_SECRET,
          "HS256",
        );

        const userId = payload.id as string;
        const role = payload.role as string;
        console.log("AUTH PAYLOAD:", payload);

        console.log("AUTH USER ID:", userId);
        console.log("AUTH ROLE:", role);
        if (!userId) {
          console.log("NO USER ID IN TOKEN");
          return clearAuthCookies(c);
        }

        if (!role) {
          console.log("NO ROLE IN TOKEN");
          return c.json(
            {
              success: false,
              message: "Token has no role",
            },
            401,
          );
        }

        c.set("userId", {
          id: userId,
          role,
        });

        // Access token is valid
        return next();
      } catch {
        console.log("Access token expired/invalid. Trying refresh token...");
      }
    }

    // 2. Access token missing/expired → try refresh token
    const refreshToken = getCookie(c, "refreshToken");

    if (!refreshToken) {
      return clearAuthCookies(c);
    }

    // 3. Verify refresh token
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

    // 4. Check refresh token in database
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

    // 5. Check expiration
    if (session.expiresAt < new Date()) {
      console.log("Refresh token expired in database");

      return clearAuthCookies(c);
    }

    // 6. Get current user role
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

    // 7. Create new access token
    const newAccessToken = await sign(
      {
        id: user.id,
        role: user.role,
        exp: Math.floor(Date.now() / 1000) + FIFTEEN_MINUTES_SECONDS,
      },
      env.JWT_ACCESS_SECRET,
    );

    // 8. Replace access token cookie
    setCookie(c, "accessToken", newAccessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      path: "/",
      maxAge: FIFTEEN_MINUTES_SECONDS,
    });

    // 9. Authenticate request
    c.set("userId", {
      id: user.id,
      role: user.role,
    });

    // 10. Continue
    return next();
  } catch (error) {
    console.error("Auth middleware error:", error);

    return clearAuthCookies(c);
  }
}
