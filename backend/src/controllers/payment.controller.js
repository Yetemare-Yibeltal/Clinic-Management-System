// payment.controller.js — Handles all payment operations for Kidus Yared Healthcare
import Payment from "../models/Payment.model.js";
import Appointment from "../models/Appointment.model.js";
import {
  initializePayment,
  verifyPayment,
  verifyWebhookSignature,
} from "../services/chapa.service.js";
import {
  getPaymentInstructions,
  validateManualPaymentSubmission,
  formatPaymentSummary,
} from "../services/manual.payment.service.js";
import { ENV } from "../config/env.js";

// ── POST /api/payments/initialize ─────────────────────
// Patient initiates a Chapa online payment for their appointment
export async function initializeChapaPayment(req, res, next) {
  try {
    const { appointmentId } = req.body;
    const patientId = req.user._id;

    // Verify the appointment exists and belongs to this patient
    const appointment = await Appointment.findById(appointmentId)
      .populate("patient", "firstName lastName email phone")
      .populate("doctor", "firstName lastName consultationFee");

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found." });
    }

    if (String(appointment.patient._id) !== String(patientId)) {
      return res
        .status(403)
        .json({ error: "This appointment does not belong to you." });
    }

    if (appointment.status === "cancelled") {
      return res
        .status(400)
        .json({ error: "Cannot pay for a cancelled appointment." });
    }

    // Check if payment already exists and is completed
    const existingPayment = await Payment.findOne({
      appointment: appointmentId,
      status: "completed",
    });

    if (existingPayment) {
      return res.status(409).json({
        error: "This appointment has already been paid.",
        payment: existingPayment,
      });
    }

    // Generate unique transaction reference
    const txRef = Payment.generateTxRef(appointmentId);

    // Build Chapa callback and return URLs
    const callbackUrl = `${ENV.CLIENT_URL}/payment/callback?tx_ref=${txRef}`;
    const returnUrl = `${ENV.CLIENT_URL}/payment/verify?tx_ref=${txRef}`;

    // Call Chapa API to get checkout URL
    const chapaResponse = await initializePayment({
      txRef,
      amount: appointment.doctor.consultationFee,
      currency: "ETB",
      email: appointment.patient.email,
      firstName: appointment.patient.firstName,
      lastName: appointment.patient.lastName,
      phone: appointment.patient.phone,
      callbackUrl,
      returnUrl,
      description: `Appointment with ${appointment.doctor.firstName} ${appointment.doctor.lastName} on ${appointment.date} at ${appointment.time}`,
    });

    // Save payment record in database
    const payment = await Payment.create({
      appointment: appointmentId,
      patient: patientId,
      doctor: appointment.doctor._id,
      amount: appointment.doctor.consultationFee,
      currency: "ETB",
      method: "chapa",
      status: "pending",
      chapaTxRef: txRef,
      chapaCheckoutUrl: chapaResponse.checkoutUrl,
      chapaInitiatedAt: new Date(),
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.status(201).json({
      message: "Payment initialized successfully.",
      checkoutUrl: chapaResponse.checkoutUrl,
      txRef,
      payment,
    });
  } catch (err) {
    next(err);
  }
}

// ── POST /api/payments/verify ──────────────────────────
// Called after patient is redirected back from Chapa payment page
// Verifies with Chapa that payment actually succeeded
export async function verifyChapaPayment(req, res, next) {
  try {
    const { txRef } = req.body;

    if (!txRef) {
      return res.status(400).json({ error: "txRef is required." });
    }

    // Find the payment record
    const payment = await Payment.findOne({ chapaTxRef: txRef });
    if (!payment) {
      return res.status(404).json({ error: "Payment record not found." });
    }

    // Verify with Chapa API
    const verifyResult = await verifyPayment(txRef);

    // Update payment record with Chapa response
    payment.chapaVerifyResponse = verifyResult.fullResponse;
    payment.chapaPaymentRef = verifyResult.chargeId;
    payment.chapaChannel = verifyResult.paymentMethod;

    if (verifyResult.status === "success") {
      payment.status = "completed";
      payment.chapaStatus = "success";
      payment.chapaCompletedAt = new Date();

      // Mark the appointment as payment confirmed
      await Appointment.findByIdAndUpdate(payment.appointment, {
        isPaid: true,
        paymentMethod: "chapa",
      });
    } else if (verifyResult.status === "failed") {
      payment.status = "failed";
      payment.chapaStatus = "failed";
    } else {
      payment.status = "pending";
      payment.chapaStatus = "pending";
    }

    await payment.save();

    res.json({
      status: payment.status,
      message:
        verifyResult.status === "success"
          ? "Payment verified successfully. Your appointment is confirmed."
          : "Payment verification failed. Please try again.",
      payment,
    });
  } catch (err) {
    next(err);
  }
}

// ── POST /api/payments/webhook ─────────────────────────
// Chapa calls this URL when a payment event happens
// We verify the signature then update the payment status
export async function handleChapaWebhook(req, res, next) {
  try {
    // Get raw body for signature verification
    const rawBody = JSON.stringify(req.body);
    const chapaSignature = req.headers["x-chapa-signature"];

    // Verify the webhook came from Chapa
    const isValid = verifyWebhookSignature(rawBody, chapaSignature);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid webhook signature." });
    }

    const { tx_ref, status, ref_id } = req.body;

    if (!tx_ref) {
      return res.status(400).json({ error: "tx_ref is missing from webhook." });
    }

    // Find the payment
    const payment = await Payment.findOne({ chapaTxRef: tx_ref });
    if (!payment) {
      // Return 200 to prevent Chapa from retrying
      return res
        .status(200)
        .json({ message: "Payment not found but acknowledged." });
    }

    // Prevent duplicate processing
    if (payment.webhookReceived && payment.status === "completed") {
      return res.status(200).json({ message: "Already processed." });
    }

    // Update payment from webhook data
    payment.webhookReceived = true;
    payment.webhookVerified = true;
    payment.chapaWebhookPayload = req.body;
    payment.chapaWebhookSignature = chapaSignature;
    payment.chapaPaymentRef = ref_id;

    if (status === "success") {
      payment.status = "completed";
      payment.chapaStatus = "success";
      payment.chapaCompletedAt = new Date();

      // Mark appointment as paid
      await Appointment.findByIdAndUpdate(payment.appointment, {
        isPaid: true,
        paymentMethod: "chapa",
      });
    } else if (status === "failed") {
      payment.status = "failed";
      payment.chapaStatus = "failed";
    }

    await payment.save();

    // Always return 200 to Chapa to acknowledge receipt
    res.status(200).json({ message: "Webhook received and processed." });
  } catch (err) {
    next(err);
  }
}

// ── POST /api/payments/manual ──────────────────────────
// Patient submits proof of manual payment (TeleBirr, CBE Birr, Cash, etc.)
export async function submitManualPayment(req, res, next) {
  try {
    const { appointmentId, method, manualTransactionId, manualNote } = req.body;

    const patientId = req.user._id;

    // Verify appointment
    const appointment = await Appointment.findById(appointmentId)
      .populate("patient", "firstName lastName email phone")
      .populate("doctor", "firstName lastName consultationFee");

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found." });
    }

    if (String(appointment.patient._id) !== String(patientId)) {
      return res
        .status(403)
        .json({ error: "This appointment does not belong to you." });
    }

    if (appointment.status === "cancelled") {
      return res
        .status(400)
        .json({ error: "Cannot pay for a cancelled appointment." });
    }

    // Check if already paid
    const existingPayment = await Payment.findOne({
      appointment: appointmentId,
      status: "completed",
    });

    if (existingPayment) {
      return res.status(409).json({
        error: "This appointment has already been paid.",
      });
    }

    // Validate manual payment proof
    const receiptPath = req.file ? `/uploads/${req.file.filename}` : null;
    const validation = validateManualPaymentSubmission(method, {
      manualTransactionId,
      manualReceiptPath: receiptPath,
    });

    if (!validation.valid) {
      return res.status(400).json({ error: validation.errors[0] });
    }

    // Create payment record — status is pending until admin confirms
    const payment = await Payment.create({
      appointment: appointmentId,
      patient: patientId,
      doctor: appointment.doctor._id,
      amount: appointment.doctor.consultationFee,
      currency: "ETB",
      method,
      status: method === "cash" ? "pending" : "pending",
      manualTransactionId: manualTransactionId || null,
      manualReceiptPath: receiptPath || null,
      manualNote: manualNote || null,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.status(201).json({
      message:
        method === "cash"
          ? "Cash payment recorded. Please pay at the clinic reception desk."
          : "Payment proof submitted. An admin will confirm your payment shortly.",
      payment,
    });
  } catch (err) {
    next(err);
  }
}

// ── GET /api/payments/instructions/:method ─────────────
// Returns payment instructions for a specific Ethiopian payment method
// Called when patient selects a payment method on the booking page
export async function getInstructions(req, res, next) {
  try {
    const { method } = req.params;
    const { amount } = req.query;

    const validMethods = [
      "telebirr",
      "cbe-birr",
      "awash-birr",
      "hellocash",
      "mobile-banking",
      "bank-transfer",
      "cash",
    ];

    if (!validMethods.includes(method)) {
      return res.status(400).json({
        error: `Invalid payment method. Must be one of: ${validMethods.join(", ")}`,
      });
    }

    const instructions = getPaymentInstructions(method, Number(amount) || 500);

    if (!instructions) {
      return res.status(404).json({ error: "Payment instructions not found." });
    }

    res.json(instructions);
  } catch (err) {
    next(err);
  }
}

// ── PATCH /api/payments/:id/confirm ───────────────────
// Admin confirms a manual payment after reviewing proof
export async function confirmManualPayment(req, res, next) {
  try {
    const { id } = req.params;

    const payment = await Payment.findById(id)
      .populate("appointment")
      .populate("patient", "firstName lastName email");

    if (!payment) {
      return res.status(404).json({ error: "Payment not found." });
    }

    if (payment.method === "chapa") {
      return res.status(400).json({
        error:
          "Chapa payments are confirmed automatically — no manual confirmation needed.",
      });
    }

    if (payment.status === "completed") {
      return res
        .status(409)
        .json({ error: "This payment is already confirmed." });
    }

    payment.status = "completed";
    payment.confirmedBy = req.user._id;
    payment.confirmedAt = new Date();

    await payment.save();

    // Mark appointment as paid
    await Appointment.findByIdAndUpdate(payment.appointment._id, {
      isPaid: true,
      paymentMethod: payment.method,
    });

    res.json({
      message:
        "Payment confirmed successfully. Appointment is now marked as paid.",
      payment,
    });
  } catch (err) {
    next(err);
  }
}

// ── PATCH /api/payments/:id/reject ────────────────────
// Admin rejects a manual payment — patient must resubmit proof
export async function rejectManualPayment(req, res, next) {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;

    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(404).json({ error: "Payment not found." });
    }

    if (payment.method === "chapa") {
      return res.status(400).json({
        error: "Cannot manually reject a Chapa payment.",
      });
    }

    if (payment.status === "completed") {
      return res.status(409).json({
        error: "Cannot reject an already confirmed payment.",
      });
    }

    payment.status = "failed";
    payment.rejectionReason =
      rejectionReason || "Payment proof was invalid or unclear.";

    await payment.save();

    res.json({
      message: "Payment rejected. Patient will need to resubmit proof.",
      payment,
    });
  } catch (err) {
    next(err);
  }
}

// ── GET /api/payments ─────────────────────────────────
// Get payment history — role scoped
// Patient: their own payments
// Admin: all payments with filters
export async function getPayments(req, res, next) {
  try {
    const { status, method, startDate, endDate } = req.query;
    const filter = {};

    if (req.user.role === "patient") {
      filter.patient = req.user._id;
    }

    if (status) filter.status = status;
    if (method) filter.method = method;

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const payments = await Payment.find(filter)
      .populate("patient", "firstName lastName email phone")
      .populate("doctor", "firstName lastName specialization")
      .populate("appointment", "date time type status")
      .populate("confirmedBy", "firstName lastName")
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (err) {
    next(err);
  }
}

// ── GET /api/payments/:id ─────────────────────────────
// Get single payment details
export async function getPaymentById(req, res, next) {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("patient", "firstName lastName email phone")
      .populate("doctor", "firstName lastName specialization")
      .populate("appointment", "date time type status")
      .populate("confirmedBy", "firstName lastName");

    if (!payment) {
      return res.status(404).json({ error: "Payment not found." });
    }

    // Patients can only view their own payments
    if (
      req.user.role === "patient" &&
      String(payment.patient._id) !== String(req.user._id)
    ) {
      return res
        .status(403)
        .json({ error: "You do not have access to this payment." });
    }

    res.json(payment);
  } catch (err) {
    next(err);
  }
}

// ── GET /api/payments/appointment/:appointmentId ──────
// Get payment status for a specific appointment
export async function getPaymentByAppointment(req, res, next) {
  try {
    const { appointmentId } = req.params;

    const payment = await Payment.findOne({ appointment: appointmentId })
      .populate("patient", "firstName lastName email")
      .populate("doctor", "firstName lastName")
      .populate("confirmedBy", "firstName lastName");

    if (!payment) {
      return res
        .status(404)
        .json({ error: "No payment found for this appointment." });
    }

    res.json(payment);
  } catch (err) {
    next(err);
  }
}
