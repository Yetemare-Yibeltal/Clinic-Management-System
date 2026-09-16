// sanitize.middleware.js — Input sanitization to prevent NoSQL injection
// Only removes MongoDB operator keys ($key) — does NOT modify string values

function sanitizeObject(obj) {
  if (typeof obj !== "object" || obj === null) return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeObject);

  const sanitized = {};
  for (const key of Object.keys(obj)) {
    // Remove keys that start with $ (MongoDB operators like $where, $gt)
    if (key.startsWith("$")) continue;
    sanitized[key] = sanitizeObject(obj[key]);
  }
  return sanitized;
}

export function sanitizeInput(req, res, next) {
  try {
    if (req.body && typeof req.body === "object") {
      req.body = sanitizeObject(req.body);
    }
    // Do NOT touch req.query in Express 5 — read-only getter
    // Do NOT touch req.params — managed by Express router
  } catch {
    // Never block on sanitization errors
  }
  next();
}
