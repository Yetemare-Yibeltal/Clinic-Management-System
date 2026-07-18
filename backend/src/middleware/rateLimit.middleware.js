// rateLimit.middleware.js — Request rate limiting to prevent abuse
import rateLimit from "express-rate-limit";

// ── General API rate limit ─────────────────────────────
// 100 requests per 15 minutes per IP
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many requests from this IP. Please try again in 15 minutes.",
  },
});

// ── Auth rate limit (stricter) ─────────────────────────
// 10 requests per 15 minutes per IP
// Prevents brute-force login attacks
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error:
      "Too many login attempts from this IP. Please try again in 15 minutes.",
  },
});

// ── Payment rate limit ─────────────────────────────────
// 20 requests per 15 minutes per IP
export const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many payment requests. Please try again in 15 minutes.",
  },
});

// ── Upload rate limit ──────────────────────────────────
// 10 uploads per hour per IP
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many file uploads. Please try again in an hour.",
  },
});
