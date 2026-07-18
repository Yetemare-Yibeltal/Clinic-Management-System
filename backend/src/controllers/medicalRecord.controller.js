// medicalRecord.controller.js — Medical record management
import MedicalRecord from "../models/MedicalRecord.model.js";
import Appointment from "../models/Appointment.model.js";
import {
  canAccessRecord,
  getPatientHealthSummary,
} from "../services/medicalRecord.service.js";

// POST /api/medical-records
// Doctor creates a medical record after an appointment
export async function createMedicalRecord(req, res, next) {
  try {
    const {
      appointmentId,
      visitDate,
      chiefComplaint,
      vitals,
      diagnosis,
      diagnosisCode,
      symptoms,
      treatmentPlan,
      prescriptions,
      labTests,
      doctorNotes,
      followUpRequired,
      followUpDate,
      followUpInstructions,
      referralRequired,
      referralTo,
      referralNote,
      allergiesNoted,
      isConfidential,
    } = req.body;

    // Verify appointment exists and belongs to this doctor
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found." });
    }

    if (
      req.user.role === "doctor" &&
      String(appointment.doctor) !== String(req.user._id)
    ) {
      return res.status(403).json({
        error: "You can only create records for your own appointments.",
      });
    }

    // Check if record already exists for this appointment
    const existing = await MedicalRecord.findOne({
      appointment: appointmentId,
    });
    if (existing) {
      return res.status(409).json({
        error: "A medical record already exists for this appointment.",
        record: existing,
      });
    }

    const record = await MedicalRecord.create({
      patient: appointment.patient,
      doctor: appointment.doctor,
      appointment: appointmentId,
      visitDate,
      visitType: appointment.type,
      chiefComplaint: chiefComplaint || appointment.symptoms || "",
      vitals: vitals || {},
      diagnosis: diagnosis || "",
      diagnosisCode: diagnosisCode || "",
      symptoms: symptoms || [],
      treatmentPlan: treatmentPlan || "",
      prescriptions: prescriptions || [],
      labTests: labTests || [],
      doctorNotes: doctorNotes || "",
      followUpRequired: followUpRequired || false,
      followUpDate: followUpDate || null,
      followUpInstructions: followUpInstructions || "",
      referralRequired: referralRequired || false,
      referralTo: referralTo || null,
      referralNote: referralNote || "",
      allergiesNoted: allergiesNoted || "",
      isConfidential: isConfidential || false,
    });

    const populated = await record.populate([
      { path: "patient", select: "firstName lastName email" },
      { path: "doctor", select: "firstName lastName specialization" },
    ]);

    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
}

// GET /api/medical-records
// Get medical records — role scoped
export async function getMedicalRecords(req, res, next) {
  try {
    const { patientId, page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter = {};

    if (req.user.role === "patient") {
      filter.patient = req.user._id;
    } else if (req.user.role === "doctor") {
      filter.doctor = req.user._id;
    } else if (req.user.role === "admin" && patientId) {
      filter.patient = patientId;
    }

    const [records, total] = await Promise.all([
      MedicalRecord.find(filter)
        .sort({ visitDate: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate("patient", "firstName lastName email phone")
        .populate("doctor", "firstName lastName specialization"),
      MedicalRecord.countDocuments(filter),
    ]);

    res.json({
      records,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/medical-records/:id
// Get a single medical record
export async function getMedicalRecordById(req, res, next) {
  try {
    const { allowed, reason, record } = await canAccessRecord(
      req.params.id,
      req.user._id,
      req.user.role,
    );

    if (!allowed) {
      return res.status(403).json({ error: reason });
    }

    const populated = await MedicalRecord.findById(req.params.id)
      .populate("patient", "firstName lastName email phone")
      .populate("doctor", "firstName lastName specialization")
      .populate("appointment", "date time type visitMode");

    res.json(populated);
  } catch (err) {
    next(err);
  }
}

// PATCH /api/medical-records/:id
// Doctor updates a medical record
export async function updateMedicalRecord(req, res, next) {
  try {
    const record = await MedicalRecord.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ error: "Medical record not found." });
    }

    // Only the doctor who created it or admin can update
    if (
      req.user.role === "doctor" &&
      String(record.doctor) !== String(req.user._id)
    ) {
      return res.status(403).json({
        error: "You can only update your own medical records.",
      });
    }

    const allowedFields = [
      "diagnosis",
      "diagnosisCode",
      "treatmentPlan",
      "prescriptions",
      "labTests",
      "doctorNotes",
      "followUpRequired",
      "followUpDate",
      "followUpInstructions",
      "referralRequired",
      "referralTo",
      "referralNote",
      "vitals",
      "symptoms",
      "allergiesNoted",
      "isConfidential",
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        record[field] = req.body[field];
      }
    }

    await record.save();

    const populated = await record.populate([
      { path: "patient", select: "firstName lastName email" },
      { path: "doctor", select: "firstName lastName specialization" },
    ]);

    res.json(populated);
  } catch (err) {
    next(err);
  }
}

// GET /api/medical-records/patient/:patientId/summary
// Get patient health summary
export async function getPatientSummary(req, res, next) {
  try {
    const { patientId } = req.params;

    // Patients can only view their own summary
    if (req.user.role === "patient" && String(req.user._id) !== patientId) {
      return res
        .status(403)
        .json({ error: "You can only view your own health summary." });
    }

    const summary = await getPatientHealthSummary(patientId);
    if (!summary) {
      return res
        .status(404)
        .json({ error: "No medical records found for this patient." });
    }

    res.json(summary);
  } catch (err) {
    next(err);
  }
}
