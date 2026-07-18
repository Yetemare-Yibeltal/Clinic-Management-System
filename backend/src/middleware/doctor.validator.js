// doctor.validator.js — Validation rules for doctor endpoints
import { body, param, query } from "express-validator";

// ── Update doctor profile ──────────────────────────────
export const validateUpdateDoctor = [
  param("id").isMongoId().withMessage("Invalid doctor ID"),

  body("firstName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("First name cannot be empty")
    .isLength({ max: 50 })
    .withMessage("First name too long"),

  body("lastName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Last name cannot be empty")
    .isLength({ max: 50 })
    .withMessage("Last name too long"),

  body("phone").optional().notEmpty().withMessage("Phone cannot be empty"),

  body("specialization")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Specialization cannot be empty"),

  body("licenseNumber")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("License number cannot be empty"),

  body("experienceYears")
    .optional()
    .isInt({ min: 0, max: 60 })
    .withMessage("Experience years must be between 0 and 60"),

  body("consultationFee")
    .optional()
    .isFloat({ min: 0, max: 100000 })
    .withMessage("Consultation fee must be between 0 and 100,000 ETB"),

  body("bio")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Bio must not exceed 1000 characters"),

  body("available")
    .optional()
    .isBoolean()
    .withMessage("Available must be true or false"),
];

// ── Toggle doctor availability ─────────────────────────
export const validateToggleAvailability = [
  param("id").isMongoId().withMessage("Invalid doctor ID"),

  body("available")
    .notEmpty()
    .withMessage("available field is required")
    .isBoolean()
    .withMessage("available must be true or false"),
];

// ── Get doctors query params ───────────────────────────
export const validateGetDoctors = [
  query("spec")
    .optional()
    .isString()
    .withMessage("Specialization must be a string"),

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
