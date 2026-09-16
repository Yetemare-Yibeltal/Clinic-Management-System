// sanitize.middleware.js — Input sanitization to prevent injection attacks

function sanitizeValue(value) {
  if (typeof value === "string") {
    return value.replace(/\$/g, "").replace(/\./g, "").trim();
  }
  if (Array.isArray(value)) return value.map(sanitizeValue);
  if (value !== null && typeof value === "object") return sanitizeObject(value);
  return value;
}

function sanitizeObject(obj) {
  const sanitized = {};
  for (const key of Object.keys(obj)) {
    if (key.startsWith("$")) continue;
    sanitized[key] = sanitizeValue(obj[key]);
  }
  return sanitized;
}

export function sanitizeInput(req, res, next) {
  try {
    if (req.body && typeof req.body === "object") {
      req.body = sanitizeObject(req.body);
    }
    // Do NOT touch req.query in Express 5 — it is a getter only
    // Do NOT touch req.params — handled by Express routing
  } catch (err) {
    // Never block requests due to sanitization errors
  }
  next();
}
