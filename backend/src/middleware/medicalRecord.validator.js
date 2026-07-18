// medicalRecord.validator.js — Validation rules for medical record endpoints
import { body, param, query } from "express-validator";

// ── Create medical record ──────────────────────────────
export const validateCreateMedicalRecord = [
  body("appointmentId")
    .notEmpty()
    .withMessage("Appointment ID is required")
    .isMongoId()
    .withMessage("Invalid appointment ID"),

  body("visitDate")
    .notEmpty()
    .withMessage("Visit date is required")
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("Visit date must be in YYYY-MM-DD format"),

  body("chiefComplaint")
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage("Chief complaint must not exceed 500 characters"),

  body("diagnosis")
    .optional()
    .isString()
    .isLength({ max: 1000 })
    .withMessage("Diagnosis must not exceed 1000 characters"),

  body("treatmentPlan")
    .optional()
    .isString()
    .isLength({ max: 2000 })
    .withMessage("Treatment plan must not exceed 2000 characters"),

  body("doctorNotes")
    .optional()
    .isString()
    .isLength({ max: 2000 })
    .withMessage("Doctor notes must not exceed 2000 characters"),

  body("vitals.bloodPressure")
    .optional()
    .isString()
    .withMessage("Blood pressure must be a string e.g. 120/80"),

  body("vitals.heartRate")
    .optional()
    .isFloat({ min: 0, max: 300 })
    .withMessage("Heart rate must be a valid number"),

  body("vitals.temperature")
    .optional()
    .isFloat({ min: 30, max: 45 })
    .withMessage("Temperature must be between 30 and 45 Celsius"),

  body("vitals.weight")
    .optional()
    .isFloat({ min: 0, max: 500 })
    .withMessage("Weight must be a valid number in kg"),

  body("vitals.height")
    .optional()
    .isFloat({ min: 0, max: 300 })
    .withMessage("Height must be a valid number in cm"),

  body("vitals.oxygenSaturation")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("Oxygen saturation must be between 0 and 100"),

  body("followUpRequired")
    .optional()
    .isBoolean()
    .withMessage("followUpRequired must be true or false"),

  body("followUpDate")
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("Follow-up date must be in YYYY-MM-DD format"),
];

// ── Update medical record ──────────────────────────────
export const validateUpdateMedicalRecord = [
  param("id").isMongoId().withMessage("Invalid medical record ID"),

  body("diagnosis")
    .optional()
    .isString()
    .isLength({ max: 1000 })
    .withMessage("Diagnosis must not exceed 1000 characters"),

  body("treatmentPlan")
    .optional()
    .isString()
    .isLength({ max: 2000 })
    .withMessage("Treatment plan must not exceed 2000 characters"),

  body("doctorNotes")
    .optional()
    .isString()
    .isLength({ max: 2000 })
    .withMessage("Notes must not exceed 2000 characters"),
];

// ── Get medical records query ──────────────────────────
export const validateGetMedicalRecords = [
  query("patientId").optional().isMongoId().withMessage("Invalid patient ID"),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive number"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Limit must be between 1 and 50"),
];
