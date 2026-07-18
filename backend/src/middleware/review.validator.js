// review.validator.js — Validation rules for review endpoints
import { body, param, query } from "express-validator";

// ── Submit a review ────────────────────────────────────
export const validateSubmitReview = [
  body("appointmentId")
    .notEmpty()
    .withMessage("Appointment ID is required")
    .isMongoId()
    .withMessage("Invalid appointment ID"),

  body("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),

  body("comment")
    .optional()
    .isString()
    .isLength({ max: 1000 })
    .withMessage("Comment must not exceed 1000 characters"),

  body("ratings.punctuality")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Punctuality rating must be between 1 and 5"),

  body("ratings.communication")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Communication rating must be between 1 and 5"),

  body("ratings.expertise")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Expertise rating must be between 1 and 5"),

  body("ratings.friendliness")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Friendliness rating must be between 1 and 5"),

  body("ratings.cleanliness")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Cleanliness rating must be between 1 and 5"),

  body("isAnonymous")
    .optional()
    .isBoolean()
    .withMessage("isAnonymous must be true or false"),
];

// ── Doctor responds to review ──────────────────────────
export const validateDoctorResponse = [
  param("id").isMongoId().withMessage("Invalid review ID"),

  body("doctorResponse")
    .notEmpty()
    .withMessage("Response text is required")
    .isString()
    .isLength({ min: 10, max: 500 })
    .withMessage("Response must be between 10 and 500 characters"),
];

// ── Admin moderates review ─────────────────────────────
export const validateModerateReview = [
  param("id").isMongoId().withMessage("Invalid review ID"),

  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["approved", "rejected", "flagged"])
    .withMessage("Status must be approved, rejected, or flagged"),

  body("moderationNote")
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage("Moderation note must not exceed 500 characters"),
];

// ── Get reviews query ──────────────────────────────────
export const validateGetReviews = [
  query("doctorId").optional().isMongoId().withMessage("Invalid doctor ID"),

  query("status")
    .optional()
    .isIn(["pending", "approved", "rejected", "flagged"])
    .withMessage("Invalid status filter"),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive number"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
];
