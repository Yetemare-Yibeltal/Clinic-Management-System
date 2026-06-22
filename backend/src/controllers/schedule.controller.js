// schedule.controller.js — Get and save doctor weekly availability grid
import Schedule from "../models/Schedule.model.js";
import User from "../models/User.model.js";

// GET /api/schedules/:doctorId
// Returns the weekly grid for a specific doctor
export async function getSchedule(req, res, next) {
  try {
    const { doctorId } = req.params;

    const doctor = await User.findOne({ _id: doctorId, role: "doctor" });
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found." });
    }

    let schedule = await Schedule.findOne({ doctor: doctorId });

    // If no schedule exists yet, return an empty grid
    if (!schedule) {
      return res.json({
        doctorId,
        doctorName: `${doctor.firstName} ${doctor.lastName}`,
        weeklyGrid: {},
      });
    }

    res.json({
      doctorId,
      doctorName: `${doctor.firstName} ${doctor.lastName}`,
      weeklyGrid: Object.fromEntries(
        [...schedule.weeklyGrid.entries()].map(([day, slots]) => [
          day,
          Object.fromEntries(slots.entries()),
        ]),
      ),
    });
  } catch (err) {
    next(err);
  }
}

// PUT /api/schedules/:doctorId
// Replaces the entire weekly grid for a doctor
// Doctors can only update their own schedule. Admins can update any.
export async function saveSchedule(req, res, next) {
  try {
    const { doctorId } = req.params;
    const { weeklyGrid } = req.body;

    const doctor = await User.findOne({ _id: doctorId, role: "doctor" });
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found." });
    }

    // Doctors may only edit their own schedule
    if (
      req.user.role === "doctor" &&
      String(req.user._id) !== String(doctorId)
    ) {
      return res
        .status(403)
        .json({ error: "You can only edit your own schedule." });
    }

    // Validate that slot values are only: avail, booked, break
    const validValues = ["avail", "booked", "break"];
    for (const day of Object.keys(weeklyGrid || {})) {
      for (const [slot, value] of Object.entries(weeklyGrid[day] || {})) {
        if (!validValues.includes(value)) {
          return res.status(400).json({
            error: `Invalid slot value "${value}". Must be avail, booked, or break.`,
          });
        }
      }
    }

    const schedule = await Schedule.findOneAndUpdate(
      { doctor: doctorId },
      { doctor: doctorId, weeklyGrid: weeklyGrid || {} },
      { new: true, upsert: true },
    );

    res.json({
      doctorId,
      doctorName: `${doctor.firstName} ${doctor.lastName}`,
      weeklyGrid: weeklyGrid || {},
    });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/schedules/:doctorId/slot
// Toggles a single time slot in the weekly grid
// Body: { day: "1", slot: "2", type: "avail" | "break" | null }
// Passing null removes the slot entirely
// Booked slots cannot be changed
export async function updateSlot(req, res, next) {
  try {
    const { doctorId } = req.params;
    const { day, slot, type } = req.body;

    if (day === undefined || slot === undefined) {
      return res.status(400).json({ error: "day and slot are required." });
    }

    const doctor = await User.findOne({ _id: doctorId, role: "doctor" });
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found." });
    }

    if (
      req.user.role === "doctor" &&
      String(req.user._id) !== String(doctorId)
    ) {
      return res
        .status(403)
        .json({ error: "You can only edit your own schedule." });
    }

    let schedule = await Schedule.findOne({ doctor: doctorId });

    // Create schedule document if it doesn't exist yet
    if (!schedule) {
      schedule = await Schedule.create({ doctor: doctorId, weeklyGrid: {} });
    }

    const dayGrid = schedule.weeklyGrid.get(String(day)) || new Map();

    // Prevent changing a booked slot
    if (dayGrid.get(String(slot)) === "booked") {
      return res.status(409).json({ error: "Cannot modify a booked slot." });
    }

    if (type === null || type === undefined) {
      dayGrid.delete(String(slot));
    } else {
      if (!["avail", "break"].includes(type)) {
        return res.status(400).json({ error: "type must be avail or break." });
      }
      dayGrid.set(String(slot), type);
    }

    schedule.weeklyGrid.set(String(day), dayGrid);
    schedule.markModified("weeklyGrid");
    await schedule.save();

    res.json({
      doctorId,
      day,
      slot,
      type: type || null,
      message: type ? `Slot set to ${type}` : "Slot removed",
    });
  } catch (err) {
    next(err);
  }
}
