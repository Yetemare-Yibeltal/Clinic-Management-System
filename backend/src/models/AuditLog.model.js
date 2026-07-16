// AuditLog.model.js — System audit trail for all important actions
import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    // ── Who performed the action ───────────────────────
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userRole: {
      type: String,
      enum: ["patient", "doctor", "admin"],
    },
    userEmail: {
      type: String,
    },

    // ── What action was performed ──────────────────────
    action: {
      type: String,
      required: true,
      enum: [
        // Auth actions
        "login",
        "logout",
        "register",
        "password_reset",
        "password_change",

        // User management
        "user_created",
        "user_updated",
        "user_deleted",
        "user_activated",
        "user_deactivated",

        // Appointment actions
        "appointment_created",
        "appointment_confirmed",
        "appointment_cancelled",
        "appointment_completed",
        "appointment_rescheduled",

        // Payment actions
        "payment_initiated",
        "payment_confirmed",
        "payment_rejected",
        "payment_refunded",

        // Doctor actions
        "doctor_profile_updated",
        "doctor_availability_changed",
        "schedule_updated",

        // Medical record actions
        "medical_record_created",
        "medical_record_updated",

        // Review actions
        "review_submitted",
        "review_approved",
        "review_rejected",

        // Department actions
        "department_created",
        "department_updated",

        // Settings actions
        "clinic_settings_updated",
        "holiday_added",
        "holiday_removed",

        // System actions
        "data_exported",
        "report_generated",
      ],
    },

    // ── What resource was affected ─────────────────────
    resourceType: {
      type: String,
      enum: [
        "user",
        "appointment",
        "payment",
        "schedule",
        "medical_record",
        "review",
        "department",
        "clinic_settings",
        "holiday",
        "notification",
        "system",
      ],
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    // ── Request details ────────────────────────────────
    ipAddress: { type: String },
    userAgent: { type: String },
    method: { type: String }, // GET, POST, PATCH, DELETE
    endpoint: { type: String }, // /api/appointments/123/status

    // ── Before and after state ─────────────────────────
    // Store what changed for complete audit trail
    previousData: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    newData: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    // ── Additional context ─────────────────────────────
    description: { type: String },
    status: {
      type: String,
      enum: ["success", "failed"],
      default: "success",
    },
    errorMessage: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// ── Indexes ────────────────────────────────────────────
auditLogSchema.index({ user: 1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ resourceType: 1, resourceId: 1 });
auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ ipAddress: 1 });

export default mongoose.model("AuditLog", auditLogSchema);
