// medicalRecord.service.js — Medical record business logic
import MedicalRecord from "../models/MedicalRecord.model.js";
import Appointment from "../models/Appointment.model.js";
import { logger } from "../config/logger.config.js";

// ── Check if a user can access a medical record ────────
export async function canAccessRecord(recordId, userId, userRole) {
  const record = await MedicalRecord.findById(recordId);

  if (!record) {
    return { allowed: false, reason: "Medical record not found" };
  }

  if (userRole === "admin") {
    return { allowed: true, record };
  }

  if (userRole === "patient" && String(record.patient) === String(userId)) {
    if (record.isConfidential) {
      return { allowed: false, reason: "This record is confidential" };
    }
    return { allowed: true, record };
  }

  if (userRole === "doctor" && String(record.doctor) === String(userId)) {
    return { allowed: true, record };
  }

  return { allowed: false, reason: "You do not have access to this record" };
}

// ── Get patient health summary ─────────────────────────
// Returns a summary of a patient's medical history
// Used on the patient profile page
export async function getPatientHealthSummary(patientId) {
  try {
    const records = await MedicalRecord.find({ patient: patientId })
      .sort({ visitDate: -1 })
      .limit(10)
      .populate("doctor", "firstName lastName specialization");

    const totalVisits = await MedicalRecord.countDocuments({
      patient: patientId,
    });

    // Get all unique diagnoses
    const diagnoses = records
      .map((r) => r.diagnosis)
      .filter(Boolean)
      .slice(0, 5);

    // Get latest vitals
    const latestRecord = records[0];
    const latestVitals = latestRecord?.vitals || null;

    // Get all prescriptions from recent records
    const recentPrescriptions = records
      .flatMap((r) => r.prescriptions || [])
      .slice(0, 10);

    return {
      totalVisits,
      recentRecords: records,
      diagnoses,
      latestVitals,
      recentPrescriptions,
    };
  } catch (err) {
    logger.error("Failed to get patient health summary:", err.message);
    return null;
  }
}

// ── Create medical record from completed appointment ───
export async function createRecordFromAppointment(appointment) {
  try {
    const existing = await MedicalRecord.findOne({
      appointment: appointment._id,
    });

    if (existing) return existing;

    const record = await MedicalRecord.create({
      patient: appointment.patient,
      doctor: appointment.doctor,
      appointment: appointment._id,
      visitDate: appointment.date,
      visitType: appointment.type,
      chiefComplaint: appointment.symptoms || "",
      diagnosis: appointment.diagnosis || "",
      prescription: appointment.prescription || "",
    });

    return record;
  } catch (err) {
    logger.error("Failed to create medical record:", err.message);
    return null;
  }
}
