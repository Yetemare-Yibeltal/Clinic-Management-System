// admin.validator.js — Validation rules for admin-only endpoints
import { body, param, query } from "express-validator";

// ── Update user status (activate/deactivate) ───────────
export const validateUpdateUserStatus = [
  param("id").isMongoId().withMessage("Invalid user ID"),

  body("isActive")
    .notEmpty()
    .withMessage("isActive field is required")
    .isBoolean()
    .withMessage("isActive must be true or false"),
];

// ── Change user role ───────────────────────────────────
export const validateChangeUserRole = [
  param("id").isMongoId().withMessage("Invalid user ID"),

  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["patient", "doctor", "admin"])
    .withMessage("Role must be patient, doctor, or admin"),
];

// ── Get all users with filters ─────────────────────────
export const validateGetUsers = [
  query("role")
    .optional()
    .isIn(["patient", "doctor", "admin"])
    .withMessage("Invalid role filter"),

  query("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be true or false"),

  query("q").optional().isString().withMessage("Search query must be a string"),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive number"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
];

// ── Reset user password (admin resets for user) ────────
export const validateAdminResetPassword = [
  param("id").isMongoId().withMessage("Invalid user ID"),
];

// ── Delete user ────────────────────────────────────────
export const validateDeleteUser = [
  param("id").isMongoId().withMessage("Invalid user ID"),
];
