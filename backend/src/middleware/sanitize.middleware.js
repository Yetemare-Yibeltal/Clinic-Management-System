// sanitize.middleware.js — Input sanitization to prevent injection attacks
import { ENV } from "../config/env.js";

// ── Sanitize a single value ────────────────────────────
function sanitizeValue(value) {
  if (typeof value === "string") {
    // Remove MongoDB operator injection attempts
    return value.replace(/\$/g, "").replace(/\./g, "").trim();
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value !== null && typeof value === "object") {
    return sanitizeObject(value);
  }

  return value;
}

// ── Sanitize an object recursively ────────────────────
function sanitizeObject(obj) {
  const sanitized = {};
  for (const key of Object.keys(obj)) {
    // Remove keys that start with $ (MongoDB operators)
    if (key.startsWith("$")) continue;
    sanitized[key] = sanitizeValue(obj[key]);
  }
  return sanitized;
}

// ── Middleware function ────────────────────────────────
export function sanitizeInput(req, res, next) {
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeObject(req.body);
  }

  if (req.query && typeof req.query === "object") {
    req.query = sanitizeObject(req.query);
  }

  if (req.params && typeof req.params === "object") {
    req.params = sanitizeObject(req.params);
  }

  next();
}
