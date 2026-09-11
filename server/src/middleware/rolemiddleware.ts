import type { Context, Next } from "hono";

export const authorize = (...roles: string[]) => {
  return async (c: Context, next: Next) => {
    const authUser = c.get("userId");
    console.log("AUTHORIZE DEBUG:", authUser);
    if (!authUser) {
      return c.json(
        {
          success: false,
          message: "Unauthorized",
        },
        401,
      );
    }

    if (!roles.includes(authUser.role)) {
      return c.json(
        {
          success: false,
          message: "Access denied",
        },
        403,
      );
    }

    await next();
  };
};
