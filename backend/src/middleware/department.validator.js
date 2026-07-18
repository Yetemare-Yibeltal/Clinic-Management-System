// department.validator.js — Validation rules for department endpoints
import { body, param } from "express-validator";

// ── Create department ──────────────────────────────────
export const validateCreateDepartment = [
  body("name")
    .notEmpty()
    .withMessage("Department name is required")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Department name must be between 2 and 100 characters"),

  body("shortCode")
    .optional()
    .trim()
    .isLength({ min: 2, max: 10 })
    .withMessage("Short code must be between 2 and 10 characters")
    .isAlpha()
    .withMessage("Short code must contain only letters"),

  body("description")
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage("Description must not exceed 500 characters"),

  body("floor").optional().isString().withMessage("Floor must be a string"),

  body("room").optional().isString().withMessage("Room must be a string"),

  body("phone").optional().isString().withMessage("Phone must be a string"),

  body("services")
    .optional()
    .isArray()
    .withMessage("Services must be an array"),

  body("services.*")
    .optional()
    .isString()
    .withMessage("Each service must be a string"),

  body("head")
    .optional()
    .isMongoId()
    .withMessage("Department head must be a valid doctor ID"),
];

// ── Update department ──────────────────────────────────
export const validateUpdateDepartment = [
  param("id").isMongoId().withMessage("Invalid department ID"),

  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Name cannot be empty")
    .isLength({ max: 100 })
    .withMessage("Name too long"),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be true or false"),

  body("head")
    .optional()
    .isMongoId()
    .withMessage("Department head must be a valid doctor ID"),
];
