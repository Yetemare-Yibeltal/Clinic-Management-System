// appointment.validator.js — Validation rules for appointment endpoints
import { body, param, query } from "express-validator";

// ── Create appointment ─────────────────────────────────
export const validateCreateAppointment = [
  body("doctorId")
    .notEmpty()
    .withMessage("Doctor is required")
    .isMongoId()
    .withMessage("Invalid doctor ID"),

  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("Date must be in YYYY-MM-DD format"),

  body("time").notEmpty().withMessage("Time slot is required"),

  body("type")
    .optional()
    .isIn(["consultation", "follow-up", "check-up", "emergency"])
    .withMessage("Invalid appointment type"),

  body("visitMode")
    .optional()
    .isIn(["in-person", "video-call"])
    .withMessage("Visit mode must be in-person or video-call"),

  body("symptoms")
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage("Symptoms must not exceed 500 characters"),

  body("priority")
    .optional()
    .isIn(["normal", "urgent", "emergency"])
    .withMessage("Invalid priority level"),
];

// ── Update appointment status ──────────────────────────
export const validateUpdateStatus = [
  param("id").isMongoId().withMessage("Invalid appointment ID"),

  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["pending", "confirmed", "cancelled", "completed", "rescheduled"])
    .withMessage("Invalid status value"),

  body("cancellationNote")
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage("Cancellation note must not exceed 500 characters"),

  body("notes")
    .optional()
    .isString()
    .isLength({ max: 1000 })
    .withMessage("Notes must not exceed 1000 characters"),
];

// ── Reschedule appointment ─────────────────────────────
export const validateReschedule = [
  param("id").isMongoId().withMessage("Invalid appointment ID"),

  body("newDate")
    .notEmpty()
    .withMessage("New date is required")
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("Date must be in YYYY-MM-DD format"),

  body("newTime").notEmpty().withMessage("New time slot is required"),
];

// ── Add diagnosis and prescription ────────────────────
export const validateDiagnosis = [
  param("id").isMongoId().withMessage("Invalid appointment ID"),

  body("diagnosis")
    .notEmpty()
    .withMessage("Diagnosis is required")
    .isLength({ max: 1000 })
    .withMessage("Diagnosis must not exceed 1000 characters"),

  body("prescription")
    .optional()
    .isLength({ max: 2000 })
    .withMessage("Prescription must not exceed 2000 characters"),

  body("notes")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Notes must not exceed 1000 characters"),
];

// ── Bulk update status ─────────────────────────────────
export const validateBulkStatus = [
  body("ids").isArray({ min: 1 }).withMessage("ids must be a non-empty array"),

  body("ids.*")
    .isMongoId()
    .withMessage("Each ID must be a valid appointment ID"),

  body("status")
    .isIn(["confirmed", "cancelled"])
    .withMessage("Bulk status must be confirmed or cancelled"),
];

// ── Get appointments query ─────────────────────────────
export const validateGetAppointments = [
  query("status")
    .optional()
    .isIn([
      "pending",
      "confirmed",
      "cancelled",
      "completed",
      "rescheduled",
      "all",
    ])
    .withMessage("Invalid status filter"),

  query("date")
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("Date must be in YYYY-MM-DD format"),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive number"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
];
