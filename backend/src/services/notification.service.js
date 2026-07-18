// notification.service.js — Create and manage in-app notifications
import Notification from "../models/Notification.model.js";
import { logger } from "../config/logger.config.js";

// ── Create a single notification ──────────────────────
export async function createNotification({
  recipientId,
  type,
  title,
  message,
  appointmentId = null,
  paymentId = null,
  priority = "normal",
  actionUrl = null,
}) {
  try {
    const notification = await Notification.create({
      recipient: recipientId,
      type,
      title,
      message,
      appointment: appointmentId,
      payment: paymentId,
      priority,
      actionUrl,
    });
    return notification;
  } catch (err) {
    logger.error("Failed to create notification:", err.message);
    return null;
  }
}

// ── Notify patient: appointment confirmed ──────────────
export async function notifyAppointmentConfirmed(appointment) {
  return createNotification({
    recipientId: String(appointment.patient),
    type: "appointment_confirmed",
    title: "Appointment Confirmed",
    message: `Your appointment on ${appointment.date} at ${appointment.time} has been confirmed.`,
    appointmentId: String(appointment._id),
    priority: "high",
    actionUrl: `/appointments/${appointment._id}`,
  });
}

// ── Notify patient: appointment cancelled ──────────────
export async function notifyAppointmentCancelled(appointment) {
  return createNotification({
    recipientId: String(appointment.patient),
    type: "appointment_cancelled",
    title: "Appointment Cancelled",
    message: `Your appointment on ${appointment.date} at ${appointment.time} has been cancelled.`,
    appointmentId: String(appointment._id),
    priority: "high",
    actionUrl: `/appointments`,
  });
}

// ── Notify doctor: new appointment booked ─────────────
export async function notifyDoctorNewAppointment(appointment, patientName) {
  return createNotification({
    recipientId: String(appointment.doctor),
    type: "new_appointment",
    title: "New Appointment Booked",
    message: `${patientName} has booked an appointment on ${appointment.date} at ${appointment.time}.`,
    appointmentId: String(appointment._id),
    priority: "normal",
    actionUrl: `/appointments/${appointment._id}`,
  });
}

// ── Notify patient: appointment reminder ──────────────
export async function notifyAppointmentReminder(appointment) {
  return createNotification({
    recipientId: String(appointment.patient),
    type: "appointment_reminder",
    title: "Appointment Reminder",
    message: `Reminder: You have an appointment tomorrow on ${appointment.date} at ${appointment.time}.`,
    appointmentId: String(appointment._id),
    priority: "high",
    actionUrl: `/appointments/${appointment._id}`,
  });
}

// ── Notify patient: payment confirmed ─────────────────
export async function notifyPaymentConfirmed(payment) {
  return createNotification({
    recipientId: String(payment.patient),
    type: "payment_confirmed",
    title: "Payment Confirmed",
    message: `Your payment of ${payment.amount} ETB has been confirmed successfully.`,
    paymentId: String(payment._id),
    priority: "high",
    actionUrl: `/payments/${payment._id}`,
  });
}

// ── Notify patient: payment rejected ──────────────────
export async function notifyPaymentRejected(payment, reason) {
  return createNotification({
    recipientId: String(payment.patient),
    type: "payment_rejected",
    title: "Payment Proof Rejected",
    message: `Your payment proof was rejected. Reason: ${reason}. Please resubmit.`,
    paymentId: String(payment._id),
    priority: "urgent",
    actionUrl: `/payments/${payment._id}`,
  });
}

// ── Notify doctor: review received ────────────────────
export async function notifyDoctorReviewReceived(review, doctorId) {
  return createNotification({
    recipientId: String(doctorId),
    type: "review_received",
    title: "New Patient Review",
    message: `A patient left you a ${review.rating}-star review.`,
    priority: "low",
    actionUrl: `/reviews`,
  });
}

// ── Notify patient: appointment rescheduled ───────────
export async function notifyAppointmentRescheduled(
  appointment,
  oldDate,
  oldTime,
) {
  return createNotification({
    recipientId: String(appointment.patient),
    type: "appointment_rescheduled",
    title: "Appointment Rescheduled",
    message: `Your appointment has been rescheduled from ${oldDate} ${oldTime} to ${appointment.date} at ${appointment.time}.`,
    appointmentId: String(appointment._id),
    priority: "high",
    actionUrl: `/appointments/${appointment._id}`,
  });
}

// ── Mark notification as read ──────────────────────────
export async function markAsRead(notificationId, userId) {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, recipient: userId },
      { isRead: true, readAt: new Date() },
      { new: true },
    );
    return notification;
  } catch (err) {
    logger.error("Failed to mark notification as read:", err.message);
    return null;
  }
}

// ── Mark all notifications as read ────────────────────
export async function markAllAsRead(userId) {
  try {
    await Notification.updateMany(
      { recipient: userId, isRead: false },
      { isRead: true, readAt: new Date() },
    );
    return true;
  } catch (err) {
    logger.error("Failed to mark all notifications as read:", err.message);
    return false;
  }
}

// ── Get unread count for a user ────────────────────────
export async function getUnreadCount(userId) {
  try {
    return await Notification.countDocuments({
      recipient: userId,
      isRead: false,
    });
  } catch (err) {
    logger.error("Failed to get unread count:", err.message);
    return 0;
  }
}
