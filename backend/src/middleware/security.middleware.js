// security.middleware.js — HTTP security headers for production hardening
import helmet from 'helmet'
import { ENV } from '../config/env.js'

// ── Helmet security headers ────────────────────────────
export const securityHeaders = helmet({
  // Content Security Policy
  contentSecurityPolicy: {
    directives: {
      defaultSrc:  ["'self'"],
      scriptSrc:   ["'self'", "'unsafe-inline'"],
      styleSrc:    ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc:     ["'self'", 'https://fonts.gstatic.com'],
      imgSrc:      ["'self'", 'data:', 'https:'],
      connectSrc:  ["'self'", 'https://api.chapa.co'],
    },
  },

  // Prevent clickjacking
  frameguard: { action: 'deny' },

  // Force HTTPS in production
  hsts: ENV.NODE_ENV === 'production'
    ? { maxAge: 31536000, includeSubDomains: true }
    : false,

  // Prevent MIME type sniffing
  noSniff: true,

  // Hide X-Powered-By header
  hidePoweredBy: true,

  // XSS filter
  xssFilter: true,
})