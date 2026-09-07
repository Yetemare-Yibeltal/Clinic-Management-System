// paymentUtils.js — Payment helper utilities for the frontend
import {
  PAYMENT_METHODS,
  PAYMENT_METHOD_MAP,
} from "../constants/paymentMethods.js";
import { formatETB } from "./formatters.js";

// ── Get payment method details ─────────────────────────
export function getPaymentMethod(id) {
  return PAYMENT_METHOD_MAP[id] || null;
}

// ── Get payment instructions text ─────────────────────
export function getPaymentInstructionSteps(method, amount) {
  const amountFormatted = formatETB(amount);

  const steps = {
    telebirr: [
      "Open your TeleBirr app on your phone",
      'Go to "Send Money"',
      `Enter the clinic number: 0911000001`,
      `Enter the amount: ${amountFormatted}`,
      "Confirm the payment",
      "Take a screenshot of the confirmation",
      "Upload the screenshot as proof of payment",
    ],
    "cbe-birr": [
      "Open your CBE Birr app",
      'Go to "Transfer"',
      `Enter the clinic account: 1000000000001`,
      `Enter the amount: ${amountFormatted}`,
      "Confirm the transfer",
      "Save the transaction ID",
      "Enter the transaction ID as your payment reference",
    ],
    "awash-birr": [
      "Open your Awash Birr app",
      'Go to "Send Money"',
      `Enter the clinic number: 0100000000001`,
      `Enter the amount: ${amountFormatted}`,
      "Confirm the payment",
      "Save the transaction ID",
      "Enter the transaction ID as your payment reference",
    ],
    hellocash: [
      "Open your HelloCash app",
      'Go to "Send"',
      `Enter the clinic number: 0911000001`,
      `Enter the amount: ${amountFormatted}`,
      "Confirm the payment",
      "Save the transaction ID",
      "Enter the transaction ID as your payment reference",
    ],
    "mobile-banking": [
      "Open your bank mobile banking app",
      'Go to "Transfer" or "Send Money"',
      "Select CBE and enter account: 1000000000001",
      `Enter the amount: ${amountFormatted}`,
      "Use your appointment ID as the reference",
      "Confirm the transfer",
      "Save the transaction reference number",
      "Enter the reference number as proof of payment",
    ],
    "bank-transfer": [
      "Visit any CBE branch or use CBE internet banking",
      "Transfer to account: 1000000000001",
      "Account name: Kidus Yared Healthcare",
      `Enter the amount: ${amountFormatted}`,
      "Use your appointment ID as the description",
      "Keep your transfer receipt",
      "Upload the receipt as proof of payment",
    ],
    cash: [
      "Visit Kidus Yared Healthcare reception desk",
      `Pay ${amountFormatted} in cash`,
      "Ask for an official receipt",
      "Your appointment will be confirmed immediately",
    ],
  };

  return steps[method] || [];
}

// ── Check if payment requires file upload ─────────────
export function requiresFileUpload(method) {
  return [
    "telebirr",
    "cbe-birr",
    "awash-birr",
    "hellocash",
    "mobile-banking",
    "bank-transfer",
  ].includes(method);
}

// ── Check if payment requires transaction ID ───────────
export function requiresTransactionId(method) {
  return method !== "cash" && method !== "chapa";
}

// ── Build payment summary for display ─────────────────
export function buildPaymentSummary(payment, appointment) {
  if (!payment || !appointment) return null;

  return {
    amount: formatETB(payment.amount),
    method: getPaymentMethod(payment.method)?.label || payment.method,
    status: payment.status,
    doctorName: `Dr. ${appointment.doctor?.firstName} ${appointment.doctor?.lastName}`,
    date: appointment.date,
    time: appointment.time,
    transactionRef: payment.chapaTxRef || payment.manualTransactionId || "N/A",
  };
}

// ── Check if refund is eligible ────────────────────────
export function isRefundEligible(payment, appointmentDate, appointmentTime) {
  if (!payment || payment.status !== "completed") return false;

  const appointmentDateTime = new Date(`${appointmentDate} ${appointmentTime}`);
  const now = new Date();
  const hoursUntil = (appointmentDateTime - now) / (1000 * 60 * 60);

  return hoursUntil >= 24;
}

// ── Get refund percentage ──────────────────────────────
export function getRefundPercentage(appointmentDate, appointmentTime) {
  const appointmentDateTime = new Date(`${appointmentDate} ${appointmentTime}`);
  const now = new Date();
  const hoursUntil = (appointmentDateTime - now) / (1000 * 60 * 60);

  if (hoursUntil >= 24) return 100;
  if (hoursUntil >= 0) return 50;
  return 0;
}
