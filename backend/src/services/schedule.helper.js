// schedule.helper.js — Helper to get available slots for a doctor on a specific date
import Schedule from "../models/Schedule.model.js";
import Appointment from "../models/Appointment.model.js";

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

/**
 * Returns a list of available time slots for a doctor on a given date.
 * A slot is available if:
 * 1. It is marked as "avail" in the doctor's weekly grid for that day
 * 2. There is no existing pending/confirmed appointment at that date/time
 *
 * @param {string} doctorId - MongoDB ObjectId of the doctor
 * @param {string} date - Date string e.g. "2025-06-25"
 * @returns {Array} - Array of available time slot strings
 */
export async function getAvailableSlotsForDate(doctorId, date) {
  const dayIndex = String(new Date(date).getDay());

  // Get doctor's weekly schedule
  const schedule = await Schedule.findOne({ doctor: doctorId });

  // If no schedule exists, return all slots as potentially available
  if (!schedule) {
    return TIME_SLOTS;
  }

  const dayGrid = schedule.weeklyGrid.get(dayIndex);

  // If no grid set for this day, doctor hasn't set availability
  if (!dayGrid || dayGrid.size === 0) {
    return [];
  }

  // Get all slots marked as "avail" for this day
  const availSlotIndexes = [];
  for (const [slotIndex, value] of dayGrid.entries()) {
    if (value === "avail") {
      availSlotIndexes.push(parseInt(slotIndex));
    }
  }

  if (availSlotIndexes.length === 0) {
    return [];
  }

  // Get all existing booked/pending appointments for this doctor on this date
  const existingAppointments = await Appointment.find({
    doctor: doctorId,
    date,
    status: { $in: ["pending", "confirmed"] },
  }).select("time");

  const bookedTimes = new Set(existingAppointments.map((a) => a.time));

  // Return only slots that are available AND not already booked
  const availableSlots = availSlotIndexes
    .filter((index) => index >= 0 && index < TIME_SLOTS.length)
    .map((index) => ({
      index,
      time: TIME_SLOTS[index],
    }))
    .filter((slot) => !bookedTimes.has(slot.time))
    .map((slot) => slot.time);

  return availableSlots;
}
