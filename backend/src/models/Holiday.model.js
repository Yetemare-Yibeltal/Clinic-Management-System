// Holiday.model.js — Clinic holidays and blocked dates
import mongoose from "mongoose";

const holidaySchema = new mongoose.Schema(
  {
    // ── Holiday details ────────────────────────────────
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },

    // ── Date range ─────────────────────────────────────
    // Single day: startDate === endDate
    // Multi-day:  startDate < endDate
    startDate: {
      type: String, // "2025-09-11"
      required: true,
    },
    endDate: {
      type: String, // "2025-09-11"
      required: true,
    },

    // ── Holiday type ───────────────────────────────────
    type: {
      type: String,
      enum: [
        "ethiopian_public", // Ethiopian public holidays
        "religious", // Religious holidays (Christmas, Eid, etc.)
        "clinic_specific", // Clinic-specific closures
        "emergency_closure", // Unexpected closures
        "maintenance", // System/facility maintenance
      ],
      default: "ethiopian_public",
    },

    // ── Recurrence ─────────────────────────────────────
    isRecurringYearly: {
      type: Boolean,
      default: false,
    },

    // ── Scope ──────────────────────────────────────────
    // null = applies to all doctors
    // specific doctors = only those doctors are unavailable
    affectedDoctors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    isFullClosure: {
      type: Boolean,
      default: true, // true = whole clinic closed
    },

    // ── Created by ─────────────────────────────────────
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // ── Status ─────────────────────────────────────────
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// ── Indexes ────────────────────────────────────────────
holidaySchema.index({ startDate: 1 });
holidaySchema.index({ endDate: 1 });
holidaySchema.index({ isActive: 1 });

// ── Static: check if a date is a holiday ──────────────
holidaySchema.statics.isHoliday = async function (dateString) {
  const holiday = await this.findOne({
    startDate: { $lte: dateString },
    endDate: { $gte: dateString },
    isActive: true,
  });
  return !!holiday;
};

export default mongoose.model("Holiday", holidaySchema);
