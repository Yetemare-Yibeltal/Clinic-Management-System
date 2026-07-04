// Department.model.js — Hospital departments for Kidus Yared Healthcare
import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    // ── Basic info ─────────────────────────────────────
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    shortCode: {
      type: String,
      unique: true,
      uppercase: true,
      trim: true,
    }, // e.g. "CARD" for Cardiology

    // ── Department head ────────────────────────────────
    head: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // ── Location in clinic ─────────────────────────────
    floor: { type: String, default: "" }, // e.g. "2nd Floor"
    room: { type: String, default: "" }, // e.g. "Room 201"
    phone: { type: String, default: "" }, // direct department phone

    // ── Working hours ──────────────────────────────────
    workingHours: {
      monday: {
        open: { type: String, default: "08:00" },
        close: { type: String, default: "17:00" },
        isOpen: { type: Boolean, default: true },
      },
      tuesday: {
        open: { type: String, default: "08:00" },
        close: { type: String, default: "17:00" },
        isOpen: { type: Boolean, default: true },
      },
      wednesday: {
        open: { type: String, default: "08:00" },
        close: { type: String, default: "17:00" },
        isOpen: { type: Boolean, default: true },
      },
      thursday: {
        open: { type: String, default: "08:00" },
        close: { type: String, default: "17:00" },
        isOpen: { type: Boolean, default: true },
      },
      friday: {
        open: { type: String, default: "08:00" },
        close: { type: String, default: "17:00" },
        isOpen: { type: Boolean, default: true },
      },
      saturday: {
        open: { type: String, default: "08:00" },
        close: { type: String, default: "13:00" },
        isOpen: { type: Boolean, default: true },
      },
      sunday: {
        open: { type: String, default: "00:00" },
        close: { type: String, default: "00:00" },
        isOpen: { type: Boolean, default: false },
      },
    },

    // ── Services offered ───────────────────────────────
    services: {
      type: [String],
      default: [],
    },

    // ── Image ──────────────────────────────────────────
    image: {
      type: String,
      default: "",
    },

    // ── Status ─────────────────────────────────────────
    isActive: {
      type: Boolean,
      default: true,
    },

    // ── Statistics (updated dynamically) ──────────────
    totalDoctors: {
      type: Number,
      default: 0,
    },
    totalAppointments: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// ── Indexes ────────────────────────────────────────────
departmentSchema.index({ name: 1 });
departmentSchema.index({ isActive: 1 });
departmentSchema.index({ shortCode: 1 });

export default mongoose.model("Department", departmentSchema);
