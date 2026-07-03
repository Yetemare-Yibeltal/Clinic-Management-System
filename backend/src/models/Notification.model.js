// Notification.model.js — System notifications for patients, doctors and admins
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    // ── Who receives this notification ─────────────────
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ── Notification type ──────────────────────────────
    type: {
      type: String,
      enum: [
        "appointment_confirmed",
        "appointment_cancelled",
        "appointment_reminder",
        "appointment_rescheduled",
        "appointment_completed",
        "payment_confirmed",
        "payment_rejected",
        "payment_reminder",
        "new_appointment", // sent to doctor when patient books
        "schedule_updated",
        "review_received", // sent to doctor when patient reviews
        "welcome", // sent on registration
        "password_reset",
        "general",
      ],
      required: true,
    },

    // ── Notification content ───────────────────────────
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },

    // ── Related documents ──────────────────────────────
    // Optional references to related records
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      default: null,
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      default: null,
    },

    // ── Read status ────────────────────────────────────
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
      default: null,
    },

    // ── Delivery channels ──────────────────────────────
    // Track which channels this notification was sent through
    sentViaEmail: {
      type: Boolean,
      default: false,
    },
    sentViaSMS: {
      type: Boolean,
      default: false,
    },
    sentViaPush: {
      type: Boolean,
      default: false,
    },

    // ── Email delivery status ──────────────────────────
    emailStatus: {
      type: String,
      enum: ["pending", "sent", "failed", "not_applicable"],
      default: "not_applicable",
    },
    emailSentAt: {
      type: Date,
      default: null,
    },
    emailError: {
      type: String,
      default: null,
    },

    // ── Priority ───────────────────────────────────────
    priority: {
      type: String,
      enum: ["low", "normal", "high", "urgent"],
      default: "normal",
    },

    // ── Action link ────────────────────────────────────
    // Frontend URL to navigate when notification is clicked
    actionUrl: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// ── Indexes ────────────────────────────────────────────
notificationSchema.index({ recipient: 1 });
notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ type: 1 });

export default mongoose.model("Notification", notificationSchema);
