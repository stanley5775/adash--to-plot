import type { Context, Next } from "hono";
export const authorize = (...roles: string[]) => {
  return async (c: Context, next: Next) => {
    const user = c.get("user");

    if (!user) {
      return c.json(
        {
          success: false,
          message: "Not authenticated",
        },
        401,
      );
    }

    if (!roles.includes(user.role)) {
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
