// apiEndpoints.js — All backend API endpoint constants
const BASE = "/api";

export const API = {
  // ── Auth ──────────────────────────────────────────
  AUTH: {
    REGISTER: `${BASE}/auth/register`,
    LOGIN: `${BASE}/auth/login`,
    ME: `${BASE}/auth/me`,
    FORGOT_PASSWORD: `${BASE}/auth/forgot-password`,
    RESET_PASSWORD: `${BASE}/auth/reset-password`,
    CHANGE_PASSWORD: `${BASE}/auth/change-password`,
    LOGOUT: `${BASE}/auth/logout`,
  },

  // ── Upload ────────────────────────────────────────
  UPLOAD: {
    AVATAR: `${BASE}/upload/avatar`,
  },

  // ── Doctors ───────────────────────────────────────
  DOCTORS: {
    LIST: `${BASE}/doctors`,
    DETAIL: (id) => `${BASE}/doctors/${id}`,
    SPECIALIZATIONS: `${BASE}/doctors/specializations/list`,
    UPDATE: (id) => `${BASE}/doctors/${id}`,
    TOGGLE_AVAILABLE: (id) => `${BASE}/doctors/${id}/availability`,
  },

  // ── Appointments ──────────────────────────────────
  APPOINTMENTS: {
    LIST: `${BASE}/appointments`,
    CREATE: `${BASE}/appointments`,
    DETAIL: (id) => `${BASE}/appointments/${id}`,
    UPDATE_STATUS: (id) => `${BASE}/appointments/${id}/status`,
    BULK_STATUS: `${BASE}/appointments/bulk-status`,
    RESCHEDULE: (id) => `${BASE}/appointments/${id}/reschedule`,
    DIAGNOSIS: (id) => `${BASE}/appointments/${id}/diagnosis`,
  },

  // ── Schedules ─────────────────────────────────────
  SCHEDULES: {
    GET: (doctorId) => `${BASE}/schedules/${doctorId}`,
    AVAILABLE: (doctorId) => `${BASE}/schedules/${doctorId}/available`,
    SAVE: (doctorId) => `${BASE}/schedules/${doctorId}`,
    UPDATE_SLOT: (doctorId) => `${BASE}/schedules/${doctorId}/slot`,
  },

  // ── Payments ──────────────────────────────────────
  PAYMENTS: {
    LIST: `${BASE}/payments`,
    INITIALIZE: `${BASE}/payments/initialize`,
    VERIFY: `${BASE}/payments/verify`,
    MANUAL: `${BASE}/payments/manual`,
    INSTRUCTIONS: (method) => `${BASE}/payments/instructions/${method}`,
    BY_APPOINTMENT: (id) => `${BASE}/payments/appointment/${id}`,
    DETAIL: (id) => `${BASE}/payments/${id}`,
    CONFIRM: (id) => `${BASE}/payments/${id}/confirm`,
    REJECT: (id) => `${BASE}/payments/${id}/reject`,
    RECEIPT: (id) => `${BASE}/payments/${id}/receipt`,
  },

  // ── Notifications ─────────────────────────────────
  NOTIFICATIONS: {
    LIST: `${BASE}/notifications`,
    UNREAD_COUNT: `${BASE}/notifications/unread-count`,
    READ: (id) => `${BASE}/notifications/${id}/read`,
    READ_ALL: `${BASE}/notifications/read-all`,
    DELETE: (id) => `${BASE}/notifications/${id}`,
    DELETE_ALL: `${BASE}/notifications`,
  },

  // ── Reviews ───────────────────────────────────────
  REVIEWS: {
    LIST: `${BASE}/reviews`,
    CREATE: `${BASE}/reviews`,
    MY_REVIEWS: `${BASE}/reviews/my`,
    DOCTOR_REVIEWS: (doctorId) => `${BASE}/reviews/doctor/${doctorId}`,
    MODERATE: (id) => `${BASE}/reviews/${id}/moderate`,
    RESPOND: (id) => `${BASE}/reviews/${id}/respond`,
  },

  // ── Medical Records ───────────────────────────────
  MEDICAL_RECORDS: {
    LIST: `${BASE}/medical-records`,
    CREATE: `${BASE}/medical-records`,
    DETAIL: (id) => `${BASE}/medical-records/${id}`,
    UPDATE: (id) => `${BASE}/medical-records/${id}`,
    SUMMARY: (patientId) =>
      `${BASE}/medical-records/patient/${patientId}/summary`,
  },

  // ── Departments ───────────────────────────────────
  DEPARTMENTS: {
    LIST: `${BASE}/departments`,
    DETAIL: (id) => `${BASE}/departments/${id}`,
    CREATE: `${BASE}/departments`,
    UPDATE: (id) => `${BASE}/departments/${id}`,
    DELETE: (id) => `${BASE}/departments/${id}`,
    ASSIGN_DOCTOR: (id) => `${BASE}/departments/${id}/assign-doctor`,
  },

  // ── Patients ──────────────────────────────────────
  PATIENTS: {
    LIST: `${BASE}/patients`,
    DETAIL: (id) => `${BASE}/patients/${id}`,
    MY_PROFILE: `${BASE}/patients/profile`,
    UPDATE_PROFILE: `${BASE}/patients/profile`,
    CHANGE_PASSWORD: `${BASE}/patients/change-password`,
  },

  // ── Reports ───────────────────────────────────────
  REPORTS: {
    DASHBOARD: `${BASE}/reports/dashboard`,
    TODAY: `${BASE}/reports/today`,
    TOP_DOCTORS: `${BASE}/reports/top-doctors`,
    MONTHLY_REVENUE: `${BASE}/reports/monthly-revenue`,
    APPOINTMENTS_STATUS: `${BASE}/reports/appointments-status`,
    PAYMENT_METHODS: `${BASE}/reports/payment-methods`,
    APPOINTMENTS: `${BASE}/reports/appointments`,
    REVENUE: `${BASE}/reports/revenue`,
    DOCTORS: `${BASE}/reports/doctors`,
    PATIENTS: `${BASE}/reports/patients`,
  },

  // ── Admin ─────────────────────────────────────────
  ADMIN: {
    USERS: `${BASE}/admin/users`,
    USER_DETAIL: (id) => `${BASE}/admin/users/${id}`,
    USER_STATUS: (id) => `${BASE}/admin/users/${id}/status`,
    USER_ROLE: (id) => `${BASE}/admin/users/${id}/role`,
    RESET_PASSWORD: (id) => `${BASE}/admin/users/${id}/reset-password`,
    DELETE_USER: (id) => `${BASE}/admin/users/${id}`,
    AUDIT_LOGS: `${BASE}/admin/audit-logs`,
    SYSTEM_STATS: `${BASE}/admin/system-stats`,
  },

  // ── Search ────────────────────────────────────────
  SEARCH: {
    GLOBAL: `${BASE}/search`,
    DOCTORS: `${BASE}/search/doctors`,
  },

  // ── Clinic Settings ───────────────────────────────
  CLINIC: {
    SETTINGS: `${BASE}/clinic-settings`,
    PAYMENT_ACCOUNTS: `${BASE}/clinic-settings/payment-accounts`,
  },

  // ── Holidays ──────────────────────────────────────
  HOLIDAYS: {
    LIST: `${BASE}/holidays`,
    CHECK: `${BASE}/holidays/check`,
    CREATE: `${BASE}/holidays`,
    UPDATE: (id) => `${BASE}/holidays/${id}`,
    DELETE: (id) => `${BASE}/holidays/${id}`,
  },
};
