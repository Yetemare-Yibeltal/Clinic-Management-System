// logger.middleware.js — HTTP request logging middleware
import { logger } from "../config/logger.config.js";
import { ENV } from "../config/env.js";

// ── Request logger ─────────────────────────────────────
// Logs: METHOD /path STATUS responseTime
export function requestLogger(req, res, next) {
  const start = Date.now();

  // Log when response finishes
  res.on("finish", () => {
    const duration = Date.now() - start;
    const method = req.method;
    const url = req.originalUrl;
    const status = res.statusCode;
    const userAgent = req.headers["user-agent"] || "";
    const ip = req.ip || req.connection?.remoteAddress || "";

    const message = `${method} ${url} ${status} ${duration}ms - ${ip}`;

    if (status >= 500) {
      logger.error(message);
    } else if (status >= 400) {
      logger.warn(message);
    } else {
      logger.info(message);
    }
  });

  next();
}

// ── Skip logging for health check ─────────────────────
export function skipHealthCheck(req, res, next) {
  if (req.path === "/api/health") {
    return next();
  }
  requestLogger(req, res, next);
}
