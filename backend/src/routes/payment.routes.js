// payment.routes.js — Maps /api/payments/* URLs to controller functions
import { Router } from "express";
import { body, param, query } from "express-validator";
import {
  initializeChapaPayment,
  verifyChapaPayment,
  handleChapaWebhook,
  submitManualPayment,
  getInstructions,
  confirmManualPayment,
  rejectManualPayment,
  getPayments,
  getPaymentById,
  getPaymentByAppointment,
} from "../controllers/payment.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { uploadSingle } from "../middleware/upload.middleware.js";

const router = Router();

// ── Validation rules ──────────────────────────────────

const initializeRules = [
  body("appointmentId")
    .notEmpty()
    .isMongoId()
    .withMessage("Valid appointment ID is required"),
];

const verifyRules = [body("txRef").notEmpty().withMessage("txRef is required")];

const manualPaymentRules = [
  body("appointmentId")
    .notEmpty()
    .isMongoId()
    .withMessage("Valid appointment ID is required"),
  body("method")
    .notEmpty()
    .isIn([
      "telebirr",
      "cbe-birr",
      "awash-birr",
      "hellocash",
      "mobile-banking",
      "cash",
      "bank-transfer",
    ])
    .withMessage("Invalid payment method"),
  body("manualTransactionId")
    .optional()
    .isString()
    .withMessage("Transaction ID must be a string"),
  body("manualNote").optional().isString().withMessage("Note must be a string"),
];

const rejectRules = [
  body("rejectionReason")
    .optional()
    .isString()
    .withMessage("Rejection reason must be a string"),
];

const instructionsRules = [
  param("method")
    .isIn([
      "telebirr",
      "cbe-birr",
      "awash-birr",
      "hellocash",
      "mobile-banking",
      "bank-transfer",
      "cash",
    ])
    .withMessage("Invalid payment method"),
  query("amount").optional().isNumeric().withMessage("Amount must be a number"),
];

// ── Routes ────────────────────────────────────────────

// Chapa webhook — NO auth required (Chapa calls this directly)
// Must be before any protect middleware
router.post("/webhook", handleChapaWebhook);

// Get payment instructions for a method (any logged in user)
router.get(
  "/instructions/:method",
  protect,
  instructionsRules,
  validate,
  getInstructions,
);

// Initialize Chapa online payment (patient only)
router.post(
  "/initialize",
  protect,
  restrictTo("patient"),
  initializeRules,
  validate,
  initializeChapaPayment,
);

// Verify Chapa payment after redirect (patient only)
router.post(
  "/verify",
  protect,
  restrictTo("patient"),
  verifyRules,
  validate,
  verifyChapaPayment,
);

// Submit manual payment proof (patient only, optional receipt upload)
router.post(
  "/manual",
  protect,
  restrictTo("patient"),
  uploadSingle("receipt"),
  manualPaymentRules,
  validate,
  submitManualPayment,
);

// Get payment by appointment ID (patient and admin)
router.get("/appointment/:appointmentId", protect, getPaymentByAppointment);

// Get all payments — patient sees own, admin sees all
router.get("/", protect, getPayments);

// Get single payment by ID
router.get("/:id", protect, getPaymentById);

// Confirm manual payment (admin only)
router.patch(
  "/:id/confirm",
  protect,
  restrictTo("admin"),
  confirmManualPayment,
);

// Reject manual payment (admin only)
router.patch(
  "/:id/reject",
  protect,
  restrictTo("admin"),
  rejectRules,
  validate,
  rejectManualPayment,
);

export default router;
