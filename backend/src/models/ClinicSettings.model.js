// ClinicSettings.model.js — Configurable clinic settings for Kidus Yared Healthcare
import mongoose from "mongoose";

const clinicSettingsSchema = new mongoose.Schema(
  {
    // ── Clinic identity ────────────────────────────────
    clinicName: {
      type: String,
      default: "Kidus Yared Healthcare",
    },
    tagline: {
      type: String,
      default: "Your Health, Our Priority",
    },
    logo: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "info@kidusyared.et",
    },
    phone: {
      type: String,
      default: "+251911223344",
    },
    alternatePhone: {
      type: String,
      default: "",
    },
    website: {
      type: String,
      default: "https://kidusyared.et",
    },

    // ── Location ───────────────────────────────────────
    address: {
      street: { type: String, default: "" },
      subCity: { type: String, default: "" },
      woreda: { type: String, default: "" },
      city: { type: String, default: "Addis Ababa" },
      region: { type: String, default: "Addis Ababa" },
      country: { type: String, default: "Ethiopia" },
      landmark: { type: String, default: "" },
    },

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

    // ── Appointment settings ───────────────────────────
    appointmentSettings: {
      defaultConsultationFee: { type: Number, default: 500 },
      maxAppointmentsPerDay: { type: Number, default: 50 },
      appointmentDuration: { type: Number, default: 30 }, // minutes
      advanceBookingDays: { type: Number, default: 30 }, // how far ahead patients can book
      cancellationHours: { type: Number, default: 24 }, // min hours before appointment to cancel
      reminderHoursBefore: { type: Number, default: 24 }, // when to send reminder
      allowVideoConsultation: { type: Boolean, default: true },
    },

    // ── Payment settings ───────────────────────────────
    paymentSettings: {
      currency: { type: String, default: "ETB" },
      acceptCash: { type: Boolean, default: true },
      acceptTeleBirr: { type: Boolean, default: true },
      acceptCBEBirr: { type: Boolean, default: true },
      acceptAwashBirr: { type: Boolean, default: true },
      acceptHelloCash: { type: Boolean, default: true },
      acceptMobileBanking: { type: Boolean, default: true },
      acceptBankTransfer: { type: Boolean, default: true },
      acceptChapa: { type: Boolean, default: true },
      teleBirrAccount: { type: String, default: "" },
      cbeBirrAccount: { type: String, default: "" },
      awashBirrAccount: { type: String, default: "" },
      helloCashAccount: { type: String, default: "" },
      bankName: { type: String, default: "Commercial Bank of Ethiopia" },
      bankAccountNumber: { type: String, default: "" },
      bankAccountName: { type: String, default: "Kidus Yared Healthcare" },
    },

    // ── Email settings ─────────────────────────────────
    emailSettings: {
      sendAppointmentConfirmation: { type: Boolean, default: true },
      sendAppointmentReminder: { type: Boolean, default: true },
      sendPaymentConfirmation: { type: Boolean, default: true },
      sendCancellationEmail: { type: Boolean, default: true },
      sendWelcomeEmail: { type: Boolean, default: true },
    },

    // ── Social media ───────────────────────────────────
    socialMedia: {
      facebook: { type: String, default: "" },
      telegram: { type: String, default: "" },
      instagram: { type: String, default: "" },
      twitter: { type: String, default: "" },
      youtube: { type: String, default: "" },
    },

    // ── System settings ────────────────────────────────
    isMaintenanceMode: {
      type: Boolean,
      default: false,
    },
    maintenanceMessage: {
      type: String,
      default: "System is under maintenance. Please try again later.",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("ClinicSettings", clinicSettingsSchema);
