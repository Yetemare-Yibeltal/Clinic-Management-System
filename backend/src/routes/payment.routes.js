// payment.routes.js — Maps /api/payments/* URLs to controller functions
import { Router } from 'express'
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
} from '../controllers/payment.controller.js'
import { protect, restrictTo } from '../middleware/auth.middleware.js'
import { validate } from '../middleware/validate.middleware.js'
import { uploadSingle } from '../middleware/upload.middleware.js'
import {
  validateInitializePayment,
  validateVerifyPayment,
  validateManualPayment,
  validateGetInstructions,
  validatePaymentId,
  validateRejectPayment,
  validateGetPayments,
  validateAppointmentId,
} from '../middleware/payment.validator.js'

const router = Router()

// ── Chapa webhook — NO auth required ──────────────────
// Chapa calls this directly when a payment event happens
// This MUST be the first route — before any protect middleware
router.post('/webhook', handleChapaWebhook)

// ── Get payment instructions for a method ─────────────
// Patient selects TeleBirr / CBE Birr / Cash etc.
// Returns account numbers and step by step instructions
router.get(
  '/instructions/:method',
  protect,
  validateGetInstructions,
  validate,
  getInstructions
)

// ── Initialize Chapa online payment ───────────────────
// Patient clicks Pay with Chapa
// Returns a checkout URL to redirect patient to Chapa page
// Chapa page handles TeleBirr, CBE Birr, Awash Birr, HelloCash, Card internally
router.post(
  '/initialize',
  protect,
  restrictTo('patient'),
  validateInitializePayment,
  validate,
  initializeChapaPayment
)

// ── Verify Chapa payment after redirect ───────────────
// Called after patient returns from Chapa checkout page
// Calls Chapa verify API to confirm payment actually succeeded
// Never trust the redirect alone — always verify server side
router.post(
  '/verify',
  protect,
  restrictTo('patient'),
  validateVerifyPayment,
  validate,
  verifyChapaPayment
)

// ── Submit manual payment proof ───────────────────────
// Patient submits proof for TeleBirr, CBE Birr, Awash Birr,
// HelloCash, Mobile Banking, Cash or Bank Transfer
// Optional: patient can upload a receipt screenshot
router.post(
  '/manual',
  protect,
  restrictTo('patient'),
  uploadSingle('receipt'),
  validateManualPayment,
  validate,
  submitManualPayment
)

// ── Get payment for a specific appointment ────────────
// Used on appointment detail page to show payment status
router.get(
  '/appointment/:appointmentId',
  protect,
  validateAppointmentId,
  validate,
  getPaymentByAppointment
)

// ── Get all payments (role scoped) ────────────────────
// Patient sees only their own payments
// Admin sees all payments with optional filters
// Supports: ?status=completed&method=telebirr&startDate=&endDate=
router.get(
  '/',
  protect,
  validateGetPayments,
  validate,
  getPayments
)

// ── Get single payment by ID ──────────────────────────
// Patient can only get their own payment
// Admin can get any payment
router.get(
  '/:id',
  protect,
  validatePaymentId,
  validate,
  getPaymentById
)

// ── Admin: confirm a manual payment ───────────────────
// After admin reviews proof (TeleBirr screenshot, bank receipt etc.)
// and confirms it is valid — marks payment as completed
// and marks the appointment as paid
router.patch(
  '/:id/confirm',
  protect,
  restrictTo('admin'),
  validatePaymentId,
  validate,
  confirmManualPayment
)

// ── Admin: reject a manual payment ────────────────────
// If proof is invalid, unclear, or wrong amount
// Patient will need to resubmit correct proof
router.patch(
  '/:id/reject',
  protect,
  restrictTo('admin'),
  validateRejectPayment,
  validate,
  rejectManualPayment
)

export default router