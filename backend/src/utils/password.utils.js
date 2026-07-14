// password.utils.js — Password reset tokens and password strength validation
import crypto from "crypto";

// ── Generate a secure password reset token ────────────
// Returns both the raw token (sent to user via email)
// and the hashed version (stored in database)
export function generatePasswordResetToken() {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  // Token expires in 10 minutes
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  return { rawToken, hashedToken, expiresAt };
}

// ── Hash a raw token for database comparison ──────────
export function hashToken(rawToken) {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

// ── Validate password strength ────────────────────────
// Returns { valid: true } or { valid: false, message: '...' }
export function validatePasswordStrength(password) {
  if (!password || typeof password !== "string") {
    return { valid: false, message: "Password is required" };
  }

  if (password.length < 6) {
    return { valid: false, message: "Password must be at least 6 characters" };
  }

  if (password.length > 100) {
    return { valid: false, message: "Password must not exceed 100 characters" };
  }

  if (/\s/.test(password)) {
    return { valid: false, message: "Password must not contain spaces" };
  }

  return { valid: true };
}

// ── Generate a temporary password ─────────────────────
// Used when admin resets a user's password manually
// Format: KY + random 8 chars + ! (always meets strength requirements)
export function generateTemporaryPassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let password = "KY";

  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  password += "!";
  return password;
}

// ── Check if reset token is expired ───────────────────
export function isTokenExpired(expiresAt) {
  return new Date() > new Date(expiresAt);
}