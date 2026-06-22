// schedule.service.js — Keeps doctor schedule slots in sync with real appointments
import Schedule from "../models/Schedule.model.js";

// TIME_SLOTS must match exactly what the frontend sends
// Index 0 = 8:00 AM, Index 1 = 9:00 AM ... Index 9 = 5:00 PM
export const TIME_SLOTS = [
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
];

// DAY_MAP converts a JavaScript Date day number to our grid index
// 0 = Sunday, 1 = Monday ... 6 = Saturday
function getDayIndex(dateString) {
  const date = new Date(dateString);
  return date.getDay();
}

function getSlotIndex(timeString) {
  return TIME_SLOTS.indexOf(timeString);
}

// Called when a new appointment is confirmed
// Marks the doctor's slot as "booked" in their weekly grid
export async function markSlotAsBooked(doctorId, date, time) {
  try {
    const dayIndex = String(getDayIndex(date));
    const slotIndex = String(getSlotIndex(time));

    if (slotIndex === "-1") return; // time not found in slots, skip

    let schedule = await Schedule.findOne({ doctor: doctorId });
    if (!schedule) {
      schedule = await Schedule.create({ doctor: doctorId, weeklyGrid: {} });
    }

    const dayGrid = schedule.weeklyGrid.get(dayIndex) || new Map();
    dayGrid.set(slotIndex, "booked");
    schedule.weeklyGrid.set(dayIndex, dayGrid);
    schedule.markModified("weeklyGrid");
    await schedule.save();
  } catch (err) {
    console.error("Failed to mark slot as booked:", err.message);
  }
}

// Called when an appointment is cancelled
// Returns the doctor's slot back to "avail"
export async function markSlotAsAvailable(doctorId, date, time) {
  try {
    const dayIndex = String(getDayIndex(date));
    const slotIndex = String(getSlotIndex(time));

    if (slotIndex === "-1") return;

    const schedule = await Schedule.findOne({ doctor: doctorId });
    if (!schedule) return;

    const dayGrid = schedule.weeklyGrid.get(dayIndex);
    if (!dayGrid) return;

    dayGrid.set(slotIndex, "avail");
    schedule.weeklyGrid.set(dayIndex, dayGrid);
    schedule.markModified("weeklyGrid");
    await schedule.save();
  } catch (err) {
    console.error("Failed to mark slot as available:", err.message);
  }
}
