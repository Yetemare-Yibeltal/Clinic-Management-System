// timeSlots.js — Available appointment time slots
export const TIME_SLOTS = [
  { index: 0, time: "8:00 AM", label: "8:00 AM", period: "Morning" },
  { index: 1, time: "9:00 AM", label: "9:00 AM", period: "Morning" },
  { index: 2, time: "10:00 AM", label: "10:00 AM", period: "Morning" },
  { index: 3, time: "11:00 AM", label: "11:00 AM", period: "Morning" },
  { index: 4, time: "12:00 PM", label: "12:00 PM", period: "Afternoon" },
  { index: 5, time: "1:00 PM", label: "1:00 PM", period: "Afternoon" },
  { index: 6, time: "2:00 PM", label: "2:00 PM", period: "Afternoon" },
  { index: 7, time: "3:00 PM", label: "3:00 PM", period: "Afternoon" },
  { index: 8, time: "4:00 PM", label: "4:00 PM", period: "Afternoon" },
  { index: 9, time: "5:00 PM", label: "5:00 PM", period: "Evening" },
];

export const TIME_SLOT_MAP = Object.fromEntries(
  TIME_SLOTS.map((s) => [s.time, s]),
);

export const DAYS = [
  { index: 0, label: "Sunday", short: "Sun" },
  { index: 1, label: "Monday", short: "Mon" },
  { index: 2, label: "Tuesday", short: "Tue" },
  { index: 3, label: "Wednesday", short: "Wed" },
  { index: 4, label: "Thursday", short: "Thu" },
  { index: 5, label: "Friday", short: "Fri" },
  { index: 6, label: "Saturday", short: "Sat" },
];
