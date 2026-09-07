// routes.js — All frontend route path constants
export const ROUTES = {
  // ── Auth ──────────────────────────────────────────
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",

  // ── Dashboard ─────────────────────────────────────
  DASHBOARD: "/dashboard",

  // ── Doctors ───────────────────────────────────────
  DOCTORS: "/doctors",
  DOCTOR_PROFILE: "/doctors/:id",

  // ── Appointments ──────────────────────────────────
  BOOK_APPOINTMENT: "/book-appointment",
  MY_APPOINTMENTS: "/appointments",
  MANAGE_APPOINTMENTS: "/manage-appointments",

  // ── Schedule ──────────────────────────────────────
  SCHEDULE: "/schedule",

  // ── Payments ──────────────────────────────────────
  PAYMENT: "/payment/:appointmentId",
  PAYMENT_CALLBACK: "/payment/callback",

  // ── Medical Records ───────────────────────────────
  MEDICAL_RECORDS: "/medical-records",

  // ── Reports ───────────────────────────────────────
  REPORTS: "/reports",

  // ── Notifications ─────────────────────────────────
  NOTIFICATIONS: "/notifications",

  // ── Profile ───────────────────────────────────────
  PATIENT_PROFILE: "/profile",
  DOCTOR_PROFILE_EDIT: "/profile/doctor",

  // ── Departments ───────────────────────────────────
  DEPARTMENTS: "/departments",

  // ── Reviews ───────────────────────────────────────
  REVIEWS: "/reviews",

  // ── Search ────────────────────────────────────────
  SEARCH: "/search",

  // ── Admin ─────────────────────────────────────────
  ADMIN_DASHBOARD: "/admin",
  ADMIN_USERS: "/admin/users",
  ADMIN_SETTINGS: "/admin/settings",

  // ── Errors ────────────────────────────────────────
  NOT_FOUND: "/404",
  UNAUTHORIZED: "/unauthorized",
};
