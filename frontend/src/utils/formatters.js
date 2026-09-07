// formatters.js — Data formatting utilities for display
import { TIME_SLOT_MAP } from "../constants/timeSlots.js";

// ── Currency ───────────────────────────────────────────
export function formatETB(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return "0 ETB";
  return `${Number(amount).toLocaleString("en-US")} ETB`;
}

export function formatETBCompact(amount) {
  if (!amount) return "0 ETB";
  if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M ETB`;
  if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K ETB`;
  return `${amount} ETB`;
}

// ── Dates ──────────────────────────────────────────────
export function formatDate(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatShortDate(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(dateString, timeString) {
  if (!dateString) return "";
  const date = formatDate(dateString);
  if (!timeString) return date;
  return `${date} at ${timeString}`;
}

export function formatRelativeTime(date) {
  if (!date) return "";
  const now = new Date();
  const diffMs = now - new Date(date);
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return formatShortDate(date);
}

export function formatDateForInput(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toISOString().split("T")[0];
}

// ── Names ──────────────────────────────────────────────
export function formatFullName(firstName, lastName) {
  return `${firstName || ""} ${lastName || ""}`.trim();
}

export function formatDoctorName(firstName, lastName) {
  return `Dr. ${firstName || ""} ${lastName || ""}`.trim();
}

export function getInitials(firstName, lastName) {
  const f = (firstName || "").charAt(0).toUpperCase();
  const l = (lastName || "").charAt(0).toUpperCase();
  return `${f}${l}`;
}

// ── Phone ──────────────────────────────────────────────
export function formatPhone(phone) {
  if (!phone) return "";
  // Format Ethiopian phone: +251911223344 → +251 911 223 344
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 12 && cleaned.startsWith("251")) {
    return `+251 ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
  }
  return phone;
}

// ── File size ──────────────────────────────────────────
export function formatFileSize(bytes) {
  if (!bytes) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ── Appointment ────────────────────────────────────────
export function formatAppointmentType(type) {
  const labels = {
    consultation: "Consultation",
    "follow-up": "Follow-up",
    "check-up": "Check-up",
    emergency: "Emergency",
  };
  return labels[type] || type;
}

export function formatVisitMode(mode) {
  const labels = {
    "in-person": "In-Person",
    "video-call": "Video Call",
  };
  return labels[mode] || mode;
}

// ── Rating ─────────────────────────────────────────────
export function formatRating(rating) {
  if (!rating) return "0.0";
  return Number(rating).toFixed(1);
}

export function getRatingStars(rating) {
  const filled = Math.round(rating || 0);
  return Array.from({ length: 5 }, (_, i) => (i < filled ? "★" : "☆")).join("");
}

// ── Experience ─────────────────────────────────────────
export function formatExperience(years) {
  if (!years) return "N/A";
  return `${years} year${years !== 1 ? "s" : ""} experience`;
}

// ── Percentage ─────────────────────────────────────────
export function formatPercentage(value, total) {
  if (!total || total === 0) return "0%";
  return `${Math.round((value / total) * 100)}%`;
}
