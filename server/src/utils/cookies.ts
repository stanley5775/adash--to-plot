import { setCookie, deleteCookie } from "hono/cookie";
import type { Context } from "hono";

export const FIFTEEN_MINUTES_SECONDS = 15 * 60;
export const REFRESH_TOKEN_SECONDS = 60 * 60 * 24 * 7;

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "None" as const,
  path: "/",
};

export function setAuthCookies(
  c: Context,
  accessToken: string,
  refreshToken: string,
) {
  setCookie(c, "accessToken", accessToken, {
    ...cookieOptions,
    maxAge: FIFTEEN_MINUTES_SECONDS,
  });

  setCookie(c, "refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: REFRESH_TOKEN_SECONDS,
  });
}

export function clearAuthCookies(c: Context) {
  deleteCookie(c, "accessToken", {
    ...cookieOptions,
    maxAge: 0,
  });

  deleteCookie(c, "refreshToken", {
    ...cookieOptions,
    maxAge: 0,
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
