import { Hono } from "hono";
import authRoutes from "./route/auth.routes";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import admin from "./route/admin.routes";
import users from "./route/users.routes";
import ati from "./route/ati.members";

const app = new Hono();
const allowedOrigins = [
  "http://localhost:3001",
  // "https://melodai-cyan.vercel.app",
];
app.use(logger());
app.use(
  "*",
  cors({
    origin: (origin) => {
      if (!origin) return origin;
      if (allowedOrigins.includes(origin)) return origin;
      return "";
    },
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);
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
app.route("/api/users", users);
app.route("/api/ati", ati);
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
