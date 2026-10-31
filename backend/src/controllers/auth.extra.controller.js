// auth.extra.controller.js — forgot/reset/change password and logout
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import TokenBlacklist from "../models/TokenBlacklist.model.js";
import { ENV } from "../config/env.js";
import {
  generatePasswordResetToken,
  hashToken,
  validatePasswordStrength,
} from "../utils/password.utils.js";

import {
  forgotPassword,
  resetPassword,
  changeOwnPassword,
  logout,
} from "../controllers/auth.extra.controller.js";
import { sendPasswordResetEmail } from "../services/email.service.js";

// POST /api/auth/forgot-password
export async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    const generic = {
      message:
        "If an account exists for this email, a reset link has been sent.",
    };

    if (!email) return res.status(400).json({ error: "Email is required." });

    const user = await User.findOne({
      email: String(email).toLowerCase().trim(),
      isActive: true,
    });
    if (!user) return res.json(generic); // never reveal whether the email exists

    const { rawToken, hashedToken, expiresAt } = generatePasswordResetToken();
    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = expiresAt;
    await user.save();

    const resetUrl = `${ENV.CLIENT_URL}/reset-password?token=${rawToken}`;
    await sendPasswordResetEmail(user, resetUrl);

    res.json(generic);
  } catch (err) {
    next(err);
  }
}

// PATCH /api/auth/reset-password
export async function resetPassword(req, res, next) {
  try {
    const { token, newPassword } = req.body;
    if (!token)
      return res.status(400).json({ error: "Reset token is required." });

    const check = validatePasswordStrength(newPassword);
    if (!check.valid) return res.status(400).json({ error: check.message });

    const user = await User.findOne({
      passwordResetToken: hashToken(token),
      passwordResetExpires: { $gt: new Date() },
    });
    if (!user)
      return res
        .status(400)
        .json({ error: "Reset link is invalid or has expired." });

    user.password = newPassword; // pre-save hook hashes it
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successfully. You can now log in." });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/auth/change-password (logged in)
export async function changeOwnPassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: "Current and new passwords are required." });
    }

    const check = validatePasswordStrength(newPassword);
    if (!check.valid) return res.status(400).json({ error: check.message });

    const user = await User.findById(req.user._id).select("+password");
    if (!user || !(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ error: "Current password is incorrect." });
    }

    user.password = newPassword;
    await user.save();
    res.json({ message: "Password changed successfully." });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/logout (logged in)
export async function logout(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      const decoded = jwt.decode(token);
      const expiresAt = decoded?.exp
        ? new Date(decoded.exp * 1000)
        : new Date(Date.now() + 7 * 864e5);
      await TokenBlacklist.updateOne(
        { token },
        { $setOnInsert: { token, user: req.user._id, expiresAt } },
        { upsert: true },
      );
    }
    res.json({ message: "Logged out successfully." });
  } catch (err) {
    next(err);
  }
}
