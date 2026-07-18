// email.service.js — All email sending functions for Kidus Yared Healthcare
import fs from "fs";
import path from "path";
import { transporter, EMAIL_DEFAULTS } from "../config/email.config.js";
import { logger } from "../config/logger.config.js";

const TEMPLATES_DIR = path.resolve("src/templates/email");

// ── Load and fill an HTML email template ──────────────
function loadTemplate(templateName, variables = {}) {
  try {
    const templatePath = path.join(TEMPLATES_DIR, `${templateName}.html`);
    let html = fs.readFileSync(templatePath, "utf8");

    // Replace all {{VARIABLE}} placeholders with real values
    for (const [key, value] of Object.entries(variables)) {
      html = html.replaceAll(`{{${key}}}`, value || "");
    }

    return html;
  } catch (err) {
    logger.error(`Failed to load email template ${templateName}:`, err.message);
    return null;
  }
}

// ── Core send function ─────────────────────────────────
async function sendEmail({ to, subject, html, text }) {
  try {
    const info = await transporter.sendMail({
      from: EMAIL_DEFAULTS.from,
      to,
      subject,
      html,
      text: text || "",
    });

    logger.info(`Email sent to ${to}: ${subject} [${info.messageId}]`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    logger.error(`Failed to send email to ${to}:`, err.message);
    return { success: false, error: err.message };
  }
}

// ── Welcome email ──────────────────────────────────────
// Sent when a new user registers
export async function sendWelcomeEmail(user) {
  const html = loadTemplate("welcome", {
    FIRST_NAME: user.firstName,
    LAST_NAME: user.lastName,
    EMAIL: user.email,
    ROLE: user.role,
    CLINIC_NAME: EMAIL_DEFAULTS.clinicName,
    CLINIC_EMAIL: EMAIL_DEFAULTS.clinicEmail,
    CLINIC_PHONE: EMAIL_DEFAULTS.clinicPhone,
    WEBSITE: EMAIL_DEFAULTS.website,
    YEAR: new Date().getFullYear(),
  });

  if (!html) return { success: false, error: "Template not found" };

  return sendEmail({
    to: user.email,
    subject: `Welcome to ${EMAIL_DEFAULTS.clinicName}!`,
    html,
  });
}

// ── Appointment confirmed email ────────────────────────
// Sent to patient when appointment is confirmed
export async function sendAppointmentConfirmedEmail(appointment) {
  const html = loadTemplate("appointment.confirmed", {
    PATIENT_NAME: `${appointment.patient.firstName} ${appointment.patient.lastName}`,
    DOCTOR_NAME: `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`,
    SPECIALIZATION: appointment.doctor.specialization || "",
    DATE: appointment.date,
    TIME: appointment.time,
    TYPE: appointment.type,
    VISIT_MODE: appointment.visitMode,
    FEE: `${appointment.fee} ETB`,
    CLINIC_NAME: EMAIL_DEFAULTS.clinicName,
    CLINIC_ADDRESS: EMAIL_DEFAULTS.clinicAddress,
    CLINIC_PHONE: EMAIL_DEFAULTS.clinicPhone,
    YEAR: new Date().getFullYear(),
  });

  if (!html) return { success: false, error: "Template not found" };

  return sendEmail({
    to: appointment.patient.email,
    subject: `Appointment Confirmed - ${appointment.date} at ${appointment.time}`,
    html,
  });
}

// ── Appointment cancelled email ────────────────────────
// Sent to patient when appointment is cancelled
export async function sendAppointmentCancelledEmail(appointment) {
  const html = loadTemplate("appointment.cancelled", {
    PATIENT_NAME: `${appointment.patient.firstName} ${appointment.patient.lastName}`,
    DOCTOR_NAME: `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`,
    DATE: appointment.date,
    TIME: appointment.time,
    CANCELLATION_NOTE: appointment.cancellationNote || "No reason provided",
    CANCELLED_BY: appointment.cancelledBy || "clinic",
    CLINIC_NAME: EMAIL_DEFAULTS.clinicName,
    CLINIC_PHONE: EMAIL_DEFAULTS.clinicPhone,
    YEAR: new Date().getFullYear(),
  });

  if (!html) return { success: false, error: "Template not found" };

  return sendEmail({
    to: appointment.patient.email,
    subject: `Appointment Cancelled - ${appointment.date} at ${appointment.time}`,
    html,
  });
}

// ── Appointment reminder email ─────────────────────────
// Sent 24 hours before appointment
export async function sendAppointmentReminderEmail(appointment) {
  const html = loadTemplate("appointment.reminder", {
    PATIENT_NAME: `${appointment.patient.firstName} ${appointment.patient.lastName}`,
    DOCTOR_NAME: `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`,
    SPECIALIZATION: appointment.doctor.specialization || "",
    DATE: appointment.date,
    TIME: appointment.time,
    VISIT_MODE: appointment.visitMode,
    CLINIC_NAME: EMAIL_DEFAULTS.clinicName,
    CLINIC_ADDRESS: EMAIL_DEFAULTS.clinicAddress,
    CLINIC_PHONE: EMAIL_DEFAULTS.clinicPhone,
    YEAR: new Date().getFullYear(),
  });

  if (!html) return { success: false, error: "Template not found" };

  return sendEmail({
    to: appointment.patient.email,
    subject: `Reminder: Appointment Tomorrow at ${appointment.time}`,
    html,
  });
}

// ── Appointment rescheduled email ──────────────────────
export async function sendAppointmentRescheduledEmail(
  appointment,
  oldDate,
  oldTime,
) {
  const html = loadTemplate("appointment.rescheduled", {
    PATIENT_NAME: `${appointment.patient.firstName} ${appointment.patient.lastName}`,
    DOCTOR_NAME: `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`,
    OLD_DATE: oldDate,
    OLD_TIME: oldTime,
    NEW_DATE: appointment.date,
    NEW_TIME: appointment.time,
    CLINIC_NAME: EMAIL_DEFAULTS.clinicName,
    CLINIC_PHONE: EMAIL_DEFAULTS.clinicPhone,
    YEAR: new Date().getFullYear(),
  });

  if (!html) return { success: false, error: "Template not found" };

  return sendEmail({
    to: appointment.patient.email,
    subject: `Appointment Rescheduled to ${appointment.date} at ${appointment.time}`,
    html,
  });
}

// ── Payment confirmed email ────────────────────────────
export async function sendPaymentConfirmedEmail(payment, appointment) {
  const html = loadTemplate("payment.confirmed", {
    PATIENT_NAME: `${payment.patient.firstName} ${payment.patient.lastName}`,
    DOCTOR_NAME: `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`,
    DATE: appointment.date,
    TIME: appointment.time,
    AMOUNT: `${payment.amount} ETB`,
    METHOD: payment.method,
    PAYMENT_ID: String(payment._id),
    CLINIC_NAME: EMAIL_DEFAULTS.clinicName,
    CLINIC_PHONE: EMAIL_DEFAULTS.clinicPhone,
    YEAR: new Date().getFullYear(),
  });

  if (!html) return { success: false, error: "Template not found" };

  return sendEmail({
    to: payment.patient.email,
    subject: `Payment Confirmed - ${payment.amount} ETB`,
    html,
  });
}

// ── Payment rejected email ─────────────────────────────
export async function sendPaymentRejectedEmail(payment, rejectionReason) {
  const html = loadTemplate("payment.rejected", {
    PATIENT_NAME: `${payment.patient.firstName} ${payment.patient.lastName}`,
    AMOUNT: `${payment.amount} ETB`,
    METHOD: payment.method,
    REJECTION_REASON: rejectionReason || "Payment proof was invalid",
    CLINIC_NAME: EMAIL_DEFAULTS.clinicName,
    CLINIC_PHONE: EMAIL_DEFAULTS.clinicPhone,
    YEAR: new Date().getFullYear(),
  });

  if (!html) return { success: false, error: "Template not found" };

  return sendEmail({
    to: payment.patient.email,
    subject: "Payment Proof Rejected - Please Resubmit",
    html,
  });
}

// ── Password reset email ───────────────────────────────
export async function sendPasswordResetEmail(user, resetUrl) {
  const html = loadTemplate("password.reset", {
    FIRST_NAME: user.firstName,
    RESET_URL: resetUrl,
    EXPIRES_IN: "10 minutes",
    CLINIC_NAME: EMAIL_DEFAULTS.clinicName,
    CLINIC_EMAIL: EMAIL_DEFAULTS.clinicEmail,
    YEAR: new Date().getFullYear(),
  });

  if (!html) return { success: false, error: "Template not found" };

  return sendEmail({
    to: user.email,
    subject: `Password Reset Request - ${EMAIL_DEFAULTS.clinicName}`,
    html,
  });
}

// ── Review received email ──────────────────────────────
// Sent to doctor when a patient submits a review
export async function sendReviewReceivedEmail(doctor, review) {
  const html = loadTemplate("review.received", {
    DOCTOR_NAME: `Dr. ${doctor.firstName} ${doctor.lastName}`,
    RATING: review.rating,
    COMMENT: review.comment || "No comment provided",
    CLINIC_NAME: EMAIL_DEFAULTS.clinicName,
    YEAR: new Date().getFullYear(),
  });

  if (!html) return { success: false, error: "Template not found" };

  return sendEmail({
    to: doctor.email,
    subject: `New Patient Review - ${review.rating}/5 Stars`,
    html,
  });
}
