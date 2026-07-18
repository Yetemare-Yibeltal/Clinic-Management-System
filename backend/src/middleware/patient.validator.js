// patient.validator.js — Validation rules for patient profile endpoints
import { body, param } from "express-validator";

// ── Update patient profile ─────────────────────────────
export const validateUpdatePatient = [
  param("id").isMongoId().withMessage("Invalid patient ID"),

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

  body("dateOfBirth")
    .optional()
    .isISO8601()
    .withMessage("Date of birth must be a valid date"),

  body("gender")
    .optional()
    .isIn(["male", "female", "other"])
    .withMessage("Gender must be male, female, or other"),

  body("bloodType")
    .optional()
    .isIn(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])
    .withMessage("Invalid blood type"),

  body("allergies")
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage("Allergies must not exceed 500 characters"),

  body("city").optional().trim().notEmpty().withMessage("City cannot be empty"),

  body("subCity")
    .optional()
    .isString()
    .withMessage("Sub-city must be a string"),

  body("woreda").optional().isString().withMessage("Woreda must be a string"),

  body("emergencyContact.name")
    .optional()
    .isString()
    .isLength({ max: 100 })
    .withMessage("Emergency contact name too long"),

  body("emergencyContact.phone")
    .optional()
    .isString()
    .withMessage("Emergency contact phone must be a string"),

  body("emergencyContact.relationship")
    .optional()
    .isString()
    .isLength({ max: 50 })
    .withMessage("Relationship must not exceed 50 characters"),
];
