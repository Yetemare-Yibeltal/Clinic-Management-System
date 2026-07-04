// MedicalRecord.model.js — Patient medical history after each appointment
import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema(
  {
    // ── Core references ────────────────────────────────
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
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
      unique: true,
    },

    // ── Visit details ──────────────────────────────────
    visitDate: {
      type: String,
      required: true,
    },
    visitType: {
      type: String,
      enum: ["consultation", "follow-up", "check-up", "emergency"],
      default: "consultation",
    },

    // ── Chief complaint ────────────────────────────────
    // What the patient came in for
    chiefComplaint: {
      type: String,
      default: "",
    },

    // ── Vital signs ────────────────────────────────────
    vitals: {
      bloodPressure: { type: String }, // e.g. "120/80"
      heartRate: { type: Number }, // beats per minute
      temperature: { type: Number }, // Celsius
      weight: { type: Number }, // kg
      height: { type: Number }, // cm
      oxygenSaturation: { type: Number }, // percentage
      respiratoryRate: { type: Number }, // breaths per minute
      bloodSugar: { type: Number }, // mg/dL
    },

    // ── Diagnosis ──────────────────────────────────────
    diagnosis: {
      type: String,
      default: "",
    },
    diagnosisCode: {
      type: String,
      default: "",
    }, // ICD-10 code if available

    // ── Symptoms observed ──────────────────────────────
    symptoms: {
      type: [String],
      default: [],
    },

    // ── Treatment plan ─────────────────────────────────
    treatmentPlan: {
      type: String,
      default: "",
    },

    // ── Prescription ───────────────────────────────────
    prescriptions: [
      {
        medicineName: { type: String, required: true },
        dosage: { type: String }, // e.g. "500mg"
        frequency: { type: String }, // e.g. "Twice daily"
        duration: { type: String }, // e.g. "7 days"
        instructions: { type: String }, // e.g. "Take after food"
        quantity: { type: Number },
      },
    ],

    // ── Lab tests ordered ──────────────────────────────
    labTests: [
      {
        testName: { type: String },
        reason: { type: String },
        status: {
          type: String,
          enum: ["ordered", "completed", "pending"],
          default: "ordered",
        },
        result: { type: String },
        resultDate: { type: Date },
        filePath: { type: String }, // uploaded lab result file
      },
    ],

    // ── Medical documents uploaded ─────────────────────
    documents: [
      {
        name: { type: String },
        type: {
          type: String,
          enum: ["lab_result", "scan", "prescription", "referral", "other"],
        },
        filePath: { type: String },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],

    // ── Doctor notes ───────────────────────────────────
    doctorNotes: {
      type: String,
      default: "",
    },

    // ── Follow up ──────────────────────────────────────
    followUpRequired: {
      type: Boolean,
      default: false,
    },
    followUpDate: {
      type: String,
      default: null,
    },
    followUpInstructions: {
      type: String,
      default: "",
    },

    // ── Referral ───────────────────────────────────────
    referralRequired: {
      type: Boolean,
      default: false,
    },
    referralTo: {
      type: String,
      default: null,
    }, // e.g. "Cardiologist"
    referralNote: {
      type: String,
      default: "",
    },

    // ── Allergies noted during visit ───────────────────
    allergiesNoted: {
      type: String,
      default: "",
    },

    // ── Visibility ─────────────────────────────────────
    // Patient can always see their own record
    // Doctor can only see records they created
    isConfidential: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// ── Indexes ────────────────────────────────────────────
medicalRecordSchema.index({ patient: 1 });
medicalRecordSchema.index({ doctor: 1 });
medicalRecordSchema.index({ patient: 1, visitDate: -1 });
medicalRecordSchema.index({ createdAt: -1 });

export default mongoose.model("MedicalRecord", medicalRecordSchema);
