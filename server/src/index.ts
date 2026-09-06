import { Hono } from "hono";
import authRoutes from "./route/auth.routes";

import { logger } from "hono/logger";
import admin from "./route/admin.routes";
const app = new Hono();
app.use(logger());
app.get("/health", (c) => {
  return c.json({
    success: true,
    data: {
      status: "ok",
      service: "adashe-backend",
    },
  });
});

app.route("/auth", authRoutes);
app.route("/admin/estate", admin);
app.onError((err, c) => {
  return c.json(
    {
      success: false,
      message: err.message,
      data: null,
    },
    400,
  );
});
export default app;
