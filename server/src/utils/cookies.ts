import { setCookie, deleteCookie } from "hono/cookie";
import type { Context } from "hono";

const isProduction = process.env.NODE_ENV === "production";

export const FIFTEEN_MINUTES_SECONDS = 15 * 60;

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? ("None" as const) : ("Lax" as const),
  path: "/",
};

export function setAuthCookies(
  c: Context,
  accessToken: string,
  refreshToken: string,
) {
  setCookie(c, "accessToken", accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
    path: "/",
    maxAge: FIFTEEN_MINUTES_SECONDS,
  });

  setCookie(c, "refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}
export function clearAuthCookies(c: Context) {
  deleteCookie(c, "accessToken", {
    path: "/",
  });

  deleteCookie(c, "refreshToken", {
    path: "/",
  });

  return c.json(
    {
      success: false,
      message: "Unauthorized",
      data: null,
    },
    401,
  );
}
