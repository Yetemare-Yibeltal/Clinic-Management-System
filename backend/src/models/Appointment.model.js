// Appointment.model.js — Booking record between a patient and a doctor
import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    // ── Who and with whom ──────────────────────────────
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

    // ── When ───────────────────────────────────────────
    date: {
      type: String,
      required: true,
    }, // e.g. "2025-06-25"
    time: {
      type: String,
      required: true,
    }, // e.g. "9:00 AM"

    // ── What kind of visit ─────────────────────────────
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

    // ── Appointment status ─────────────────────────────
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed", "rescheduled"],
      default: "pending",
    },

    // ── Rescheduling ───────────────────────────────────
    // If appointment is rescheduled, store the new date and time
    rescheduledDate: { type: String },
    rescheduledTime: { type: String },
    rescheduledAt: { type: Date },
    rescheduledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // ── Notes ──────────────────────────────────────────
    symptoms: {
      type: String,
      default: "",
    }, // filled by patient at booking time
    notes: {
      type: String,
      default: "",
    }, // filled by doctor after the visit

    // ── Payment ────────────────────────────────────────
    // Consultation fee in Ethiopian Birr
    fee: {
      type: Number,
      default: 500,
    },

    // Whether the appointment fee has been paid
    isPaid: {
      type: Boolean,
      default: false,
    },

    // Which payment method was used
    // Updated automatically when payment is confirmed
    paymentMethod: {
      type: String,
      enum: [
        "chapa",
        "telebirr",
        "cbe-birr",
        "awash-birr",
        "hellocash",
        "mobile-banking",
        "cash",
        "bank-transfer",
        null,
      ],
      default: null,
    },

    // Reference to the Payment document
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      default: null,
    },

    // ── Cancellation tracking ──────────────────────────
    cancelledBy: {
      type: String,
      enum: ["patient", "doctor", "admin", null],
      default: null,
    },
    cancellationNote: {
      type: String,
      default: "",
    },
    cancelledAt: {
      type: Date,
    },

    // ── Follow up ──────────────────────────────────────
    // If doctor recommends a follow-up appointment
    followUpRequired: {
      type: Boolean,
      default: false,
    },
    followUpDate: {
      type: String,
    },
    followUpNotes: {
      type: String,
    },

    // ── Diagnosis and prescription ─────────────────────
    // Filled by doctor after the appointment is completed
    diagnosis: {
      type: String,
      default: "",
    },
    prescription: {
      type: String,
      default: "",
    },

    // ── Priority ───────────────────────────────────────
    priority: {
      type: String,
      enum: ["normal", "urgent", "emergency"],
      default: "normal",
    },

    // ── Check-in tracking ─────────────────────────────
    // When patient actually arrived at the clinic
    checkedInAt: {
      type: Date,
    },
    checkedInBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // ── Completion tracking ────────────────────────────
    completedAt: {
      type: Date,
    },

    // ── Rating and feedback ────────────────────────────
    // Patient rates the appointment after completion
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    feedback: {
      type: String,
      default: "",
    },
    ratedAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  },
);

// ── Indexes for fast lookups ──────────────────────────
appointmentSchema.index({ patient: 1 });
appointmentSchema.index({ doctor: 1 });
appointmentSchema.index({ date: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ isPaid: 1 });
appointmentSchema.index({ doctor: 1, date: 1, time: 1 });
appointmentSchema.index({ createdAt: -1 });

// ── Virtual: is the appointment upcoming? ─────────────
appointmentSchema.virtual("isUpcoming").get(function () {
  const appointmentDate = new Date(this.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return appointmentDate >= today && this.status !== "cancelled";
});

// ── Virtual: is the appointment today? ───────────────
appointmentSchema.virtual("isToday").get(function () {
  const appointmentDate = new Date(this.date);
  const today = new Date();
  return (
    appointmentDate.getFullYear() === today.getFullYear() &&
    appointmentDate.getMonth() === today.getMonth() &&
    appointmentDate.getDate() === today.getDate()
  );
});

// ── Pre-save: set cancelledAt when status changes to cancelled ──
appointmentSchema.pre("save", function (next) {
  if (this.isModified("status") && this.status === "cancelled") {
    this.cancelledAt = new Date();
  }
  if (this.isModified("status") && this.status === "completed") {
    this.completedAt = new Date();
  }
  next();
});

export default mongoose.model("Appointment", appointmentSchema);
