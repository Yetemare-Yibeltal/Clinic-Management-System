// reminder.service.js — Appointment reminder logic for cron job
import Appointment from "../models/Appointment.model.js";
import { sendAppointmentReminderEmail } from "./email.service.js";
import { notifyAppointmentReminder } from "./notification.service.js";
import { logger } from "../config/logger.config.js";

// ── Send reminders for tomorrow's appointments ─────────
// Called by cron job every morning at 8:00 AM
export async function sendTomorrowReminders() {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];

    const appointments = await Appointment.find({
      date: tomorrowStr,
      status: "confirmed",
    })
      .populate("patient", "firstName lastName email phone")
      .populate("doctor", "firstName lastName specialization");

    logger.info(
      `Found ${appointments.length} appointments for reminders on ${tomorrowStr}`,
    );

    let emailsSent = 0;
    let notificationsSent = 0;

    for (const appointment of appointments) {
      // Send email reminder
      if (appointment.patient?.email) {
        const result = await sendAppointmentReminderEmail(appointment);
        if (result.success) emailsSent++;
      }

      // Send in-app notification
      await notifyAppointmentReminder(appointment);
      notificationsSent++;
    }

    logger.info(
      `Reminders sent — Emails: ${emailsSent}, Notifications: ${notificationsSent}`,
    );

    return {
      total: appointments.length,
      emailsSent,
      notificationsSent,
    };
  } catch (err) {
    logger.error("Failed to send appointment reminders:", err.message);
    return { total: 0, emailsSent: 0, notificationsSent: 0 };
  }
}

// ── Send reminder for a specific appointment ───────────
// Used when admin manually triggers a reminder
export async function sendSingleReminder(appointmentId) {
  try {
    const appointment = await Appointment.findById(appointmentId)
      .populate("patient", "firstName lastName email phone")
      .populate("doctor", "firstName lastName specialization");

    if (!appointment) {
      return { success: false, error: "Appointment not found" };
    }

    if (appointment.status !== "confirmed") {
      return {
        success: false,
        error: "Can only send reminders for confirmed appointments",
      };
    }

    const emailResult = await sendAppointmentReminderEmail(appointment);
    await notifyAppointmentReminder(appointment);

    return {
      success: true,
      emailSent: emailResult.success,
    };
  } catch (err) {
    logger.error("Failed to send single reminder:", err.message);
    return { success: false, error: err.message };
  }
}
