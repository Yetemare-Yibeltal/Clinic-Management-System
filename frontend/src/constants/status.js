// status.js — Appointment and payment status constants
export const APPOINTMENT_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  CANCELLED: "cancelled",
  COMPLETED: "completed",
  RESCHEDULED: "rescheduled",
};

export const APPOINTMENT_STATUS_LABELS = {
  pending: "Pending",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
  completed: "Completed",
  rescheduled: "Rescheduled",
};

export const APPOINTMENT_STATUS_COLORS = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  confirmed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
  completed: "bg-green-500/20 text-green-400 border-green-500/30",
  rescheduled: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

export const PAYMENT_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed",
  REFUNDED: "refunded",
  CANCELLED: "cancelled",
};

export const PAYMENT_STATUS_LABELS = {
  pending: "Pending",
  completed: "Paid",
  failed: "Failed",
  refunded: "Refunded",
  cancelled: "Cancelled",
};

export const PAYMENT_STATUS_COLORS = {
  pending: "bg-yellow-500/20 text-yellow-400",
  completed: "bg-green-500/20 text-green-400",
  failed: "bg-red-500/20 text-red-400",
  refunded: "bg-blue-500/20 text-blue-400",
  cancelled: "bg-gray-500/20 text-gray-400",
};

export const APPOINTMENT_TYPES = [
  { value: "consultation", label: "Consultation" },
  { value: "follow-up", label: "Follow-up" },
  { value: "check-up", label: "Check-up" },
  { value: "emergency", label: "Emergency" },
];

export const VISIT_MODES = [
  { value: "in-person", label: "In-Person" },
  { value: "video-call", label: "Video Call" },
];

export const PRIORITY_LEVELS = [
  { value: "normal", label: "Normal" },
  { value: "urgent", label: "Urgent" },
  { value: "emergency", label: "Emergency" },
];
