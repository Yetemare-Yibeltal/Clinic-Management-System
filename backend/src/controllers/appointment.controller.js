// appointment.controller.js — Create, list, update and manage appointments
import Appointment from "../models/Appointment.model.js";
import User from "../models/User.model.js";

// POST /api/appointments
export async function createAppointment(req, res, next) {
  try {
    const { doctorId, date, time, type, visitMode, symptoms, paymentMethod } =
      req.body;
    const patientId = req.user._id;

    const doctor = await User.findOne({ _id: doctorId, role: "doctor" });
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found." });
    }

    if (!doctor.available) {
      return res
        .status(400)
        .json({ error: "This doctor is currently unavailable for booking." });
    }

    // Prevent double-booking the same doctor at the same date/time
    const conflict = await Appointment.findOne({
      doctor: doctorId,
      date,
      time,
      status: { $in: ["pending", "confirmed"] },
    });

    if (conflict) {
      return res
        .status(409)
        .json({
          error:
            "This time slot is no longer available. Please choose another.",
        });
    }

    const appointment = await Appointment.create({
      patient: patientId,
      doctor: doctorId,
      date,
      time,
      type: type || "consultation",
      visitMode: visitMode || "in-person",
      symptoms: symptoms || "",
      fee: doctor.consultationFee,
      paymentMethod: paymentMethod || "cash",
      status: "pending",
    });

    const populated = await appointment.populate([
      { path: "patient", select: "firstName lastName email phone" },
      {
        path: "doctor",
        select: "firstName lastName specialization consultationFee",
      },
    ]);

    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
}

// GET /api/appointments
// Patients see only their own. Doctors see only theirs. Admins see all.
export async function getAppointments(req, res, next) {
  try {
    const { status, date, doctorId, q } = req.query;
    const filter = {};

    if (req.user.role === "patient") {
      filter.patient = req.user._id;
    } else if (req.user.role === "doctor") {
      filter.doctor = req.user._id;
    }
    // admin: no restriction, sees everything

    if (status && status !== "all") filter.status = status;
    if (date && date !== "all") filter.date = date;
    if (doctorId && doctorId !== "all") filter.doctor = doctorId;

    let appointments = await Appointment.find(filter)
      .populate("patient", "firstName lastName email phone city")
      .populate("doctor", "firstName lastName specialization consultationFee")
      .sort({ date: -1, time: 1 });

    // Optional search by patient or doctor name (done in-memory since names are in joined docs)
    if (q) {
      const query = q.toLowerCase();
      appointments = appointments.filter((a) => {
        const patientName =
          `${a.patient?.firstName} ${a.patient?.lastName}`.toLowerCase();
        const doctorName =
          `${a.doctor?.firstName} ${a.doctor?.lastName}`.toLowerCase();
        return patientName.includes(query) || doctorName.includes(query);
      });
    }

    res.json(appointments);
  } catch (err) {
    next(err);
  }
}

// GET /api/appointments/:id
export async function getAppointmentById(req, res, next) {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("patient", "firstName lastName email phone city")
      .populate("doctor", "firstName lastName specialization consultationFee");

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found." });
    }

    // Patients/doctors can only view their own appointment
    if (
      req.user.role === "patient" &&
      String(appointment.patient._id) !== String(req.user._id)
    ) {
      return res
        .status(403)
        .json({ error: "You do not have access to this appointment." });
    }
    if (
      req.user.role === "doctor" &&
      String(appointment.doctor._id) !== String(req.user._id)
    ) {
      return res
        .status(403)
        .json({ error: "You do not have access to this appointment." });
    }

    res.json(appointment);
  } catch (err) {
    next(err);
  }
}

// PATCH /api/appointments/:id/status
export async function updateAppointmentStatus(req, res, next) {
  try {
    const { status, cancellationNote, notes } = req.body;
    const validStatuses = [
      "pending",
      "confirmed",
      "cancelled",
      "completed",
      "rescheduled",
    ];

    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ error: `Status must be one of: ${validStatuses.join(", ")}` });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found." });
    }

    // Patients may only cancel their own appointment
    if (req.user.role === "patient") {
      if (String(appointment.patient) !== String(req.user._id)) {
        return res
          .status(403)
          .json({ error: "You can only modify your own appointments." });
      }
      if (status !== "cancelled") {
        return res
          .status(403)
          .json({ error: "Patients may only cancel appointments." });
      }
      appointment.cancelledBy = "patient";
    }

    // Doctors may only update their own appointments
    if (
      req.user.role === "doctor" &&
      String(appointment.doctor) !== String(req.user._id)
    ) {
      return res
        .status(403)
        .json({ error: "You can only modify your own appointments." });
    }

    if (req.user.role === "admin" && status === "cancelled") {
      appointment.cancelledBy = "admin";
    }

    appointment.status = status;
    if (cancellationNote) appointment.cancellationNote = cancellationNote;
    if (notes) appointment.notes = notes;

    await appointment.save();

    const populated = await appointment.populate([
      { path: "patient", select: "firstName lastName email phone" },
      { path: "doctor", select: "firstName lastName specialization" },
    ]);

    res.json(populated);
  } catch (err) {
    next(err);
  }
}

// PATCH /api/appointments/bulk-status
// Admin only — approve or reject many appointments at once
export async function bulkUpdateStatus(req, res, next) {
  try {
    const { ids, status } = req.body;
    const validStatuses = ["confirmed", "cancelled"];

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "ids must be a non-empty array." });
    }
    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ error: `Status must be one of: ${validStatuses.join(", ")}` });
    }

    const result = await Appointment.updateMany(
      { _id: { $in: ids } },
      {
        $set: {
          status,
          ...(status === "cancelled" && { cancelledBy: "admin" }),
        },
      },
    );

    res.json({ updatedCount: result.modifiedCount });
  } catch (err) {
    next(err);
  }
}
