// report.validator.js — Validation rules for report endpoints
import { query } from "express-validator";

// ── Common date range validation ───────────────────────
export const validateDateRange = [
  query("range")
    .optional()
    .isIn(["today", "week", "month", "year", "custom"])
    .withMessage("Range must be today, week, month, year, or custom"),

  query("startDate")
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("Start date must be in YYYY-MM-DD format"),

  query("endDate")
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("End date must be in YYYY-MM-DD format")
    .custom((endDate, { req }) => {
      if (req.query.startDate && endDate < req.query.startDate) {
        throw new Error("End date must be after start date");
      }
      return true;
    }),
];

// ── Dashboard stats validation ─────────────────────────
export const validateDashboardStats = [
  query("period")
    .optional()
    .isIn(["today", "week", "month", "year"])
    .withMessage("Period must be today, week, month, or year"),
];

// ── Revenue report validation ──────────────────────────
export const validateRevenueReport = [
  ...validateDateRange,
  query("groupBy")
    .optional()
    .isIn(["day", "week", "month"])
    .withMessage("groupBy must be day, week, or month"),
];

// ── Doctor performance validation ──────────────────────
export const validateDoctorReport = [
  ...validateDateRange,
  query("doctorId").optional().isMongoId().withMessage("Invalid doctor ID"),
];
