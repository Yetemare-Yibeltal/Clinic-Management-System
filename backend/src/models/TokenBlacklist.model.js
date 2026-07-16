// TokenBlacklist.model.js — Invalidated JWT tokens for secure logout
import mongoose from "mongoose";

const tokenBlacklistSchema = new mongoose.Schema(
  {
    // The full JWT token string
    token: {
      type: String,
      required: true,
      unique: true,
    },

    // Who this token belonged to
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // When this token was blacklisted (logged out)
    blacklistedAt: {
      type: Date,
      default: Date.now,
    },

    // When the token naturally expires
    // We use this to auto-clean old entries from the database
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: false,
  },
);

// ── Auto-delete expired tokens ─────────────────────────
// MongoDB TTL index removes documents when expiresAt passes
// This keeps the blacklist collection clean automatically
tokenBlacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
tokenBlacklistSchema.index({ token: 1 });
tokenBlacklistSchema.index({ user: 1 });

export default mongoose.model("TokenBlacklist", tokenBlacklistSchema);
