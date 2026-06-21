// doctor.controller.js — List, search, filter and get single doctor details
import User from "../models/User.model.js";

// GET /api/doctors?spec=Cardiologist&q=ahmed
export async function getAllDoctors(req, res, next) {
  try {
    const { spec, q } = req.query;

    const filter = { role: "doctor" };

    if (spec && spec !== "All") {
      filter.specialization = spec;
    }

    if (q) {
      filter.$or = [
        { firstName: { $regex: q, $options: "i" } },
        { lastName: { $regex: q, $options: "i" } },
        { specialization: { $regex: q, $options: "i" } },
      ];
    }

    const doctors = await User.find(filter)
      .select("-password")
      .sort({ firstName: 1 });

    res.json(doctors);
  } catch (err) {
    next(err);
  }
}

// GET /api/doctors/:id
export async function getDoctorById(req, res, next) {
  try {
    const doctor = await User.findOne({
      _id: req.params.id,
      role: "doctor",
    }).select("-password");

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found." });
    }

    res.json(doctor);
  } catch (err) {
    next(err);
  }
}

// GET /api/doctors/specializations/list
export async function getSpecializations(req, res, next) {
  try {
    const specializations = await User.distinct("specialization", {
      role: "doctor",
    });
    res.json(specializations.filter(Boolean));
  } catch (err) {
    next(err);
  }
}
