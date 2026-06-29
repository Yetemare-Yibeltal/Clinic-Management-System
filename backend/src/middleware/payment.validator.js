// payment.validator.js — Validation rules for all payment endpoints
import { body, param, query } from "express-validator";

// ── Valid Ethiopian payment methods ───────────────────
const VALID_METHODS = [
  "chapa",
  "telebirr",
  "cbe-birr",
  "awash-birr",
  "hellocash",
  "mobile-banking",
  "cash",
  "bank-transfer",
];

const MANUAL_METHODS = [
  "telebirr",
  "cbe-birr",
  "awash-birr",
  "hellocash",
  "mobile-banking",
  "cash",
  "bank-transfer",
];

// ── Initialize Chapa payment validation ───────────────
export const validateInitializePayment = [
  body("appointmentId")
    .notEmpty()
    .withMessage("Appointment ID is required")
    .isMongoId()
    .withMessage("Appointment ID must be a valid ID"),
];

// ── Verify Chapa payment validation ───────────────────
export const validateVerifyPayment = [
  body("txRef")
    .notEmpty()
    .withMessage("Transaction reference (txRef) is required")
    .isString()
    .withMessage("txRef must be a string")
    .matches(/^KY-/)
    .withMessage("txRef must be a valid Kidus Yared transaction reference"),
];

// ── Manual payment submission validation ──────────────
export const validateManualPayment = [
  body("appointmentId")
    .notEmpty()
    .withMessage("Appointment ID is required")
    .isMongoId()
    .withMessage("Appointment ID must be a valid ID"),

  body("method")
    .notEmpty()
    .withMessage("Payment method is required")
    .isIn(MANUAL_METHODS)
    .withMessage(`Payment method must be one of: ${MANUAL_METHODS.join(", ")}`),

  body("manualTransactionId")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Transaction ID must be between 3 and 100 characters"),

  body("manualNote")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Note must not exceed 500 characters"),
];

// ── Payment instructions validation ───────────────────
export const validateGetInstructions = [
  param("method")
    .notEmpty()
    .withMessage("Payment method is required")
    .isIn(MANUAL_METHODS)
    .withMessage(`Method must be one of: ${MANUAL_METHODS.join(", ")}`),

  query("amount")
    .optional()
    .isNumeric()
    .withMessage("Amount must be a number")
    .custom((value) => {
      if (Number(value) < 1) {
        throw new Error("Amount must be at least 1 ETB");
      }
      if (Number(value) > 100000) {
        throw new Error("Amount cannot exceed 100,000 ETB");
      }
      return true;
    }),
];

// ── Confirm/reject payment validation ─────────────────
export const validatePaymentId = [
  param("id")
    .notEmpty()
    .withMessage("Payment ID is required")
    .isMongoId()
    .withMessage("Payment ID must be a valid ID"),
];

export const validateRejectPayment = [
  param("id")
    .notEmpty()
    .withMessage("Payment ID is required")
    .isMongoId()
    .withMessage("Payment ID must be a valid ID"),

  body("rejectionReason")
    .notEmpty()
    .withMessage("Rejection reason is required when rejecting a payment")
    .isString()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage("Rejection reason must be between 10 and 500 characters"),
];

// ── Get payments list validation ──────────────────────
export const validateGetPayments = [
  query("status")
    .optional()
    .isIn(["pending", "completed", "failed", "refunded", "cancelled"])
    .withMessage("Invalid status filter"),

  query("method")
    .optional()
    .isIn(VALID_METHODS)
    .withMessage(`Method must be one of: ${VALID_METHODS.join(", ")}`),

  query("startDate")
    .optional()
    .isISO8601()
    .withMessage("startDate must be a valid date (YYYY-MM-DD)"),

  query("endDate")
    .optional()
    .isISO8601()
    .withMessage("endDate must be a valid date (YYYY-MM-DD)")
    .custom((endDate, { req }) => {
      if (
        req.query.startDate &&
        new Date(endDate) < new Date(req.query.startDate)
      ) {
        throw new Error("endDate must be after startDate");
      }
      return true;
    }),
];

// ── Get payment by appointment validation ─────────────
export const validateAppointmentId = [
  param("appointmentId")
    .notEmpty()
    .withMessage("Appointment ID is required")
    .isMongoId()
    .withMessage("Appointment ID must be a valid ID"),
];
