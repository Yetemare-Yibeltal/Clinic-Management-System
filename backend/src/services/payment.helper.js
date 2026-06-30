// payment.helper.js — Reusable utilities for formatting and processing payments
// Used by: payment.controller.js, and later by frontend receipt generation

// ── Format an amount as Ethiopian Birr ────────────────
// Example: formatETB(500) → "500 ETB"
// Example: formatETB(1250.5) → "1,250.50 ETB"
export function formatETB(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "0 ETB";
  }

  const formatted = Number(amount).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return `${formatted} ETB`;
}

// ── Generate a unique, human-readable receipt number ──
// Format: KY-RCP-YYYYMMDD-XXXXX
// Example: KY-RCP-20250625-A3F9K
export function generateReceiptNumber() {
  const now = new Date();
  const dateStr =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0");

  const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();

  return `KY-RCP-${dateStr}-${randomPart}`;
}

// ── Calculate refund amount ────────────────────────────
// Kidus Yared Healthcare refund policy:
// - Cancelled more than 24 hours before appointment: 100% refund
// - Cancelled within 24 hours: 50% refund
// - Cancelled after appointment time has passed: no refund
export function calculateRefundAmount(
  payment,
  appointmentDate,
  appointmentTime,
) {
  if (payment.status !== "completed") {
    return {
      eligible: false,
      refundAmount: 0,
      reason: "Payment was not completed, nothing to refund.",
    };
  }

  const appointmentDateTime = new Date(`${appointmentDate} ${appointmentTime}`);
  const now = new Date();
  const hoursUntilAppointment = (appointmentDateTime - now) / (1000 * 60 * 60);

  if (hoursUntilAppointment < 0) {
    return {
      eligible: false,
      refundAmount: 0,
      reason: "Appointment time has already passed. No refund available.",
    };
  }

  if (hoursUntilAppointment >= 24) {
    return {
      eligible: true,
      refundAmount: payment.amount,
      refundPercentage: 100,
      reason: "Cancelled more than 24 hours in advance. Full refund.",
    };
  }

  const partialRefund = Math.round(payment.amount * 0.5);
  return {
    eligible: true,
    refundAmount: partialRefund,
    refundPercentage: 50,
    reason: "Cancelled within 24 hours of appointment. 50% refund applied.",
  };
}

// ── Build a printable receipt object ───────────────────
// Used to generate the data for a downloadable/printable PDF receipt
export function buildReceiptData(payment, appointment) {
  const methodLabels = {
    chapa: "Chapa Online Payment",
    telebirr: "TeleBirr",
    "cbe-birr": "CBE Birr",
    "awash-birr": "Awash Birr",
    hellocash: "HelloCash",
    "mobile-banking": "Mobile Banking",
    cash: "Cash",
    "bank-transfer": "Bank Transfer",
  };

  return {
    receiptNumber: generateReceiptNumber(),
    clinicName: "Kidus Yared Healthcare",
    clinicAddress: "Addis Ababa, Ethiopia",
    clinicPhone: "+251 911 223 344",

    paymentId: String(payment._id),
    paymentDate:
      payment.confirmedAt || payment.chapaCompletedAt || payment.createdAt,
    paymentMethod: methodLabels[payment.method] || payment.method,
    paymentStatus: payment.status,
    amount: formatETB(payment.amount),
    amountRaw: payment.amount,
    currency: payment.currency,

    patientName: appointment.patient
      ? `${appointment.patient.firstName} ${appointment.patient.lastName}`
      : "Unknown Patient",
    patientPhone: appointment.patient?.phone || "",
    patientEmail: appointment.patient?.email || "",

    doctorName: appointment.doctor
      ? `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`
      : "Unknown Doctor",
    doctorSpecialization: appointment.doctor?.specialization || "",

    appointmentDate: appointment.date,
    appointmentTime: appointment.time,
    appointmentType: appointment.type,

    transactionReference:
      payment.chapaTxRef || payment.manualTransactionId || "N/A",

    issuedAt: new Date(),
  };
}

// ── Validate that an amount is a valid ETB payment ────
// Used before initializing any payment to prevent invalid amounts
export function isValidPaymentAmount(amount) {
  const num = Number(amount);

  if (isNaN(num)) return false;
  if (num <= 0) return false;
  if (num > 100000) return false; // sanity cap: 100,000 ETB max per transaction

  return true;
}

// ── Get a human readable label for a payment method ───
export function getMethodLabel(method) {
  const labels = {
    chapa: "Chapa Online Payment",
    telebirr: "TeleBirr",
    "cbe-birr": "CBE Birr",
    "awash-birr": "Awash Birr",
    hellocash: "HelloCash",
    "mobile-banking": "Mobile Banking",
    cash: "Cash",
    "bank-transfer": "Bank Transfer",
  };

  return labels[method] || method;
}

// ── Get a human readable label for a payment status ───
export function getStatusLabel(status) {
  const labels = {
    pending: "Pending Confirmation",
    completed: "Payment Completed",
    failed: "Payment Failed",
    refunded: "Refunded",
    cancelled: "Cancelled",
  };

  return labels[status] || status;
}
