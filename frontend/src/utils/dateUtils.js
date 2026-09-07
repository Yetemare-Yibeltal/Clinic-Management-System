// dateUtils.js — Date manipulation for booking and calendar
// ── Get today as YYYY-MM-DD string ────────────────────
export function today() {
  return new Date().toISOString().split("T")[0];
}

// ── Get tomorrow as YYYY-MM-DD string ─────────────────
export function tomorrow() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

// ── Add days to a date ─────────────────────────────────
export function addDays(dateString, days) {
  const d = new Date(dateString);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

// ── Get day of week index (0=Sunday, 6=Saturday) ──────
export function getDayOfWeek(dateString) {
  return new Date(dateString).getDay();
}

// ── Check if a date is today ───────────────────────────
export function isToday(dateString) {
  return dateString === today();
}

// ── Check if a date is in the past ────────────────────
export function isPast(dateString) {
  return dateString < today();
}

// ── Check if a date is a weekend ──────────────────────
export function isWeekend(dateString) {
  const day = getDayOfWeek(dateString);
  return day === 0; // Only Sunday is closed (Saturday is half day)
}

// ── Generate next N dates from today ──────────────────
export function getNextDates(count = 14) {
  const dates = [];
  let current = new Date();
  current.setDate(current.getDate() + 1); // Start from tomorrow

  while (dates.length < count) {
    const dateStr = current.toISOString().split("T")[0];
    if (!isWeekend(dateStr)) {
      dates.push({
        date: dateStr,
        dayName: current.toLocaleDateString("en-US", { weekday: "short" }),
        dayNumber: current.getDate(),
        month: current.toLocaleDateString("en-US", { month: "short" }),
        isToday: isToday(dateStr),
      });
    }
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

// ── Get week dates for schedule grid ──────────────────
export function getWeekDates(startDate = null) {
  const start = startDate ? new Date(startDate) : new Date();
  const day = start.getDay();
  const monday = new Date(start);
  monday.setDate(start.getDate() - day + (day === 0 ? -6 : 1));

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return {
      date: date.toISOString().split("T")[0],
      dayIndex: date.getDay(),
      dayName: date.toLocaleDateString("en-US", { weekday: "long" }),
      dayShort: date.toLocaleDateString("en-US", { weekday: "short" }),
      dayNumber: date.getDate(),
      isToday: isToday(date.toISOString().split("T")[0]),
      isPast: isPast(date.toISOString().split("T")[0]),
    };
  });
}

// ── Format date for display ────────────────────────────
export function formatDisplayDate(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ── Get age from date of birth ─────────────────────────
export function getAge(dateOfBirth) {
  if (!dateOfBirth) return null;
  const today = new Date();
  const birth = new Date(dateOfBirth);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

// ── Check if advance booking limit is exceeded ─────────
export function isWithinBookingWindow(dateString, maxDays = 30) {
  const date = new Date(dateString);
  const limit = new Date();
  limit.setDate(limit.getDate() + maxDays);
  return date <= limit;
}
