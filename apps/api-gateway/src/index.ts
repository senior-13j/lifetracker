import cors from "cors";
import express from "express";
import helmet from "helmet";
import { createProxyMiddleware } from "http-proxy-middleware";

import { env, errorHandler } from "@lifetracker/backend-common";

const app = express();
const port = Number(env("API_GATEWAY_PORT", "4000"));

app.use(helmet());
app.use(cors({ origin: env("WEB_ORIGIN", "http://localhost:3000"), credentials: true }));

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "api-gateway", timestamp: new Date().toISOString() });
});

app.use(
  "/api/auth",
  createProxyMiddleware({
    target: env("AUTH_SERVICE_URL", "http://auth-service:4001"),
    changeOrigin: true,
    pathRewrite: (path) => `/auth${path}`
  })
);

app.use(
  "/api/habits",
  createProxyMiddleware({
    target: env("HABIT_SERVICE_URL", "http://habit-service:4002"),
    changeOrigin: true,
    pathRewrite: (path) => `/habits${path}`
  })
);

app.use(
  "/api/dashboard",
  createProxyMiddleware({
    target: env("HABIT_SERVICE_URL", "http://habit-service:4002"),
    changeOrigin: true,
    pathRewrite: (path) => `/dashboard${path}`
  })
);

app.use(
  "/api/challenges",
  createProxyMiddleware({
    target: env("HABIT_SERVICE_URL", "http://habit-service:4002"),
    changeOrigin: true,
    pathRewrite: (path) => `/challenges${path}`
  })
);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`api-gateway listening on ${port}`);
});
