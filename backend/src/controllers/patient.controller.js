// patient.controller.js — Patient profile and history management
import User from "../models/User.model.js";
import Appointment from "../models/Appointment.model.js";
import { deleteFile } from "../utils/file.utils.js";

// GET /api/patients/profile
// Patient views their own profile
export async function getMyProfile(req, res, next) {
  try {
    const patient = await User.findById(req.user._id).select(
      "-password -passwordResetToken -passwordResetExpires",
    );

    if (!patient) {
      return res.status(404).json({ error: "Patient not found." });
    }

    res.json(patient);
  } catch (err) {
    next(err);
  }
}

// PATCH /api/patients/profile
// Patient updates their own profile
export async function updateMyProfile(req, res, next) {
  try {
    const {
      firstName,
      lastName,
      phone,
      city,
      region,
      subCity,
      woreda,
      dateOfBirth,
      gender,
      bloodType,
      allergies,
      emergencyContact,
    } = req.body;

    const patient = await User.findById(req.user._id);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found." });
    }

    // Update only provided fields
    if (firstName) patient.firstName = firstName;
    if (lastName) patient.lastName = lastName;
    if (phone) patient.phone = phone;
    if (city) patient.city = city;
    if (region) patient.region = region;
    if (subCity !== undefined) patient.subCity = subCity;
    if (woreda !== undefined) patient.woreda = woreda;
    if (dateOfBirth) patient.dateOfBirth = dateOfBirth;
    if (gender) patient.gender = gender;
    if (bloodType) patient.bloodType = bloodType;
    if (allergies !== undefined) patient.allergies = allergies;
    if (emergencyContact) patient.emergencyContact = emergencyContact;

    await patient.save();

    res.json({
      message: "Profile updated successfully.",
      patient: {
        id: patient._id,
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.email,
        phone: patient.phone,
        city: patient.city,
        region: patient.region,
        subCity: patient.subCity,
        woreda: patient.woreda,
        dateOfBirth: patient.dateOfBirth,
        gender: patient.gender,
        bloodType: patient.bloodType,
        allergies: patient.allergies,
        emergencyContact: patient.emergencyContact,
        avatar: patient.avatar,
        initials: patient.initials,
      },
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/patients/:id (admin only)
// Admin views any patient's full profile
export async function getPatientById(req, res, next) {
  try {
    const patient = await User.findOne({
      _id: req.params.id,
      role: "patient",
    }).select("-password -passwordResetToken -passwordResetExpires");

    if (!patient) {
      return res.status(404).json({ error: "Patient not found." });
    }

    // Get appointment stats for this patient
    const [total, completed, cancelled] = await Promise.all([
      Appointment.countDocuments({ patient: patient._id }),
      Appointment.countDocuments({ patient: patient._id, status: "completed" }),
      Appointment.countDocuments({ patient: patient._id, status: "cancelled" }),
    ]);

    res.json({
      patient,
      appointmentStats: { total, completed, cancelled },
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/patients (admin only)
// Admin lists all patients with search and filter
export async function getAllPatients(req, res, next) {
  try {
    const { q, page = 1, limit = 20, isActive } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter = { role: "patient" };
    if (isActive !== undefined) filter.isActive = isActive === "true";

    if (q) {
      filter.$or = [
        { firstName: { $regex: q, $options: "i" } },
        { lastName: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { phone: { $regex: q, $options: "i" } },
      ];
    }

    const [patients, total] = await Promise.all([
      User.find(filter)
        .select("-password -passwordResetToken -passwordResetExpires")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      User.countDocuments(filter),
    ]);

    res.json({
      patients,
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

// PATCH /api/patients/change-password
// Patient changes their own password
export async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: "Current and new passwords are required." });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ error: "New password must be at least 6 characters." });
    }

    const patient = await User.findById(req.user._id).select("+password");

    const isMatch = await patient.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ error: "Current password is incorrect." });
    }

    patient.password = newPassword;
    await patient.save();

    res.json({ message: "Password changed successfully." });
  } catch (err) {
    next(err);
  }
}
