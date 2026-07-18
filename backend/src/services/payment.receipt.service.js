// payment.receipt.service.js — Payment receipt generation
import Payment from "../models/Payment.model.js";
import Appointment from "../models/Appointment.model.js";
import {
  generateReceiptNumber,
  formatETB,
  getMethodLabel,
} from "./payment.helper.js";
import { logger } from "../config/logger.config.js";

// ── Generate receipt data for a payment ───────────────
export async function generateReceipt(paymentId) {
  try {
    const payment = await Payment.findById(paymentId)
      .populate("patient", "firstName lastName email phone city")
      .populate("doctor", "firstName lastName specialization")
      .populate("appointment", "date time type visitMode");

    if (!payment) {
      return { success: false, error: "Payment not found" };
    }

    if (payment.status !== "completed") {
      return {
        success: false,
        error: "Receipt only available for completed payments",
      };
    }

    const receipt = {
      // ── Receipt metadata ────────────────────────────
      receiptNumber: generateReceiptNumber(),
      generatedAt: new Date(),
      issuedAt:
        payment.confirmedAt || payment.chapaCompletedAt || payment.createdAt,

      // ── Clinic details ──────────────────────────────
      clinic: {
        name: "Kidus Yared Healthcare",
        address: "Addis Ababa, Ethiopia",
        phone: "+251911223344",
        email: "info@kidusyared.et",
        website: "https://kidusyared.et",
      },

      // ── Patient details ─────────────────────────────
      patient: {
        name: `${payment.patient.firstName} ${payment.patient.lastName}`,
        email: payment.patient.email,
        phone: payment.patient.phone,
        city: payment.patient.city,
      },

      // ── Doctor details ──────────────────────────────
      doctor: {
        name: `Dr. ${payment.doctor.firstName} ${payment.doctor.lastName}`,
        specialization: payment.doctor.specialization,
      },

      // ── Appointment details ─────────────────────────
      appointment: {
        date: payment.appointment?.date,
        time: payment.appointment?.time,
        type: payment.appointment?.type,
        visitMode: payment.appointment?.visitMode,
      },

      // ── Payment details ─────────────────────────────
      payment: {
        id: String(payment._id),
        method: getMethodLabel(payment.method),
        methodCode: payment.method,
        amount: payment.amount,
        amountFormatted: formatETB(payment.amount),
        currency: payment.currency,
        status: payment.status,
        transactionRef:
          payment.chapaTxRef || payment.manualTransactionId || "N/A",
      },
    };

    return { success: true, receipt };
  } catch (err) {
    logger.error("Failed to generate receipt:", err.message);
    return { success: false, error: err.message };
  }
}

// ── Get receipt HTML string ────────────────────────────
// Simple HTML receipt for printing
export function buildReceiptHTML(receipt) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Payment Receipt - ${receipt.receiptNumber}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; }
    .header { text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 20px; }
    .clinic-name { font-size: 24px; font-weight: bold; color: #2563eb; }
    .receipt-title { font-size: 18px; margin: 10px 0; color: #666; }
    .receipt-number { font-size: 14px; color: #888; }
    .section { margin: 15px 0; }
    .section-title { font-weight: bold; color: #2563eb; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 10px; }
    .row { display: flex; justify-content: space-between; margin: 5px 0; }
    .label { color: #666; }
    .value { font-weight: 500; }
    .total { font-size: 20px; font-weight: bold; color: #2563eb; text-align: right; border-top: 2px solid #2563eb; padding-top: 10px; margin-top: 10px; }
    .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #888; border-top: 1px solid #eee; padding-top: 15px; }
    .status-badge { display: inline-block; background: #dcfce7; color: #166534; padding: 4px 12px; border-radius: 20px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="header">
    <div class="clinic-name">${receipt.clinic.name}</div>
    <div class="receipt-title">Official Payment Receipt</div>
    <div class="receipt-number">Receipt No: ${receipt.receiptNumber}</div>
  </div>

  <div class="section">
    <div class="section-title">Patient Information</div>
    <div class="row"><span class="label">Name:</span><span class="value">${receipt.patient.name}</span></div>
    <div class="row"><span class="label">Phone:</span><span class="value">${receipt.patient.phone}</span></div>
    <div class="row"><span class="label">Email:</span><span class="value">${receipt.patient.email}</span></div>
  </div>

  <div class="section">
    <div class="section-title">Appointment Details</div>
    <div class="row"><span class="label">Doctor:</span><span class="value">${receipt.doctor.name}</span></div>
    <div class="row"><span class="label">Specialization:</span><span class="value">${receipt.doctor.specialization}</span></div>
    <div class="row"><span class="label">Date:</span><span class="value">${receipt.appointment.date}</span></div>
    <div class="row"><span class="label">Time:</span><span class="value">${receipt.appointment.time}</span></div>
    <div class="row"><span class="label">Type:</span><span class="value">${receipt.appointment.type}</span></div>
  </div>

  <div class="section">
    <div class="section-title">Payment Information</div>
    <div class="row"><span class="label">Payment Method:</span><span class="value">${receipt.payment.method}</span></div>
    <div class="row"><span class="label">Transaction Ref:</span><span class="value">${receipt.payment.transactionRef}</span></div>
    <div class="row"><span class="label">Status:</span><span class="value"><span class="status-badge">PAID</span></span></div>
    <div class="row"><span class="label">Date:</span><span class="value">${new Date(receipt.issuedAt).toLocaleDateString()}</span></div>
    <div class="total">Total: ${receipt.payment.amountFormatted}</div>
  </div>

  <div class="footer">
    <p>${receipt.clinic.name} | ${receipt.clinic.address}</p>
    <p>Tel: ${receipt.clinic.phone} | Email: ${receipt.clinic.email}</p>
    <p>Thank you for choosing ${receipt.clinic.name}!</p>
  </div>
</body>
</html>
  `.trim();
}
