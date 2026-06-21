// Appointment.model.js — Booking record between a patient and a doctor
import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    // ── Who and with whom ──────────────────────────
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ── When ───────────────────────────────────────
    date: { type: String, required: true }, // e.g. "2025-06-25"
    time: { type: String, required: true }, // e.g. "9:00 AM"

    // ── What kind of visit ─────────────────────────
    type: {
      type: String,
      enum: ["consultation", "follow-up", "check-up", "emergency"],
      default: "consultation",
    },

    visitMode: {
      type: String,
      enum: ["in-person", "video-call"],
      default: "in-person",
    },

    // ── Status tracking ─────────────────────────────
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed", "rescheduled"],
      default: "pending",
    },

    // ── Notes ───────────────────────────────────────
    symptoms: { type: String, default: "" }, // filled by patient at booking
    notes: { type: String, default: "" }, // filled by doctor after visit

    // ── Payment (Ethiopian context) ────────────────
    fee: { type: Number, default: 500 }, // ETB
    isPaid: { type: Boolean, default: false },
    paymentMethod: {
      type: String,
      enum: ["cash", "telebirr", "cbe-birr", "cbhi"],
      default: "cash",
    },

    // ── Cancellation tracking ───────────────────────
    cancelledBy: { type: String },
    cancellationNote: { type: String },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Appointment", appointmentSchema);
