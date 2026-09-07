// permissions.js — Role-based permission checks
import { ROLES } from "../constants/roles.js";

// ── Role checks ────────────────────────────────────────
export function isAdmin(user) {
  return user?.role === ROLES.ADMIN;
}
export function isDoctor(user) {
  return user?.role === ROLES.DOCTOR;
}
export function isPatient(user) {
  return user?.role === ROLES.PATIENT;
}

// ── Appointment permissions ────────────────────────────
export function canBookAppointment(user) {
  return isPatient(user);
}

export function canConfirmAppointment(user) {
  return isAdmin(user) || isDoctor(user);
}

export function canCancelAppointment(user, appointment) {
  if (!user || !appointment) return false;
  if (isAdmin(user)) return true;
  if (
    isDoctor(user) &&
    String(appointment.doctor?._id || appointment.doctor) === String(user.id)
  )
    return true;
  if (
    isPatient(user) &&
    String(appointment.patient?._id || appointment.patient) === String(user.id)
  )
    return true;
  return false;
}

export function canViewAppointment(user, appointment) {
  if (!user || !appointment) return false;
  if (isAdmin(user)) return true;
  if (
    isDoctor(user) &&
    String(appointment.doctor?._id || appointment.doctor) === String(user.id)
  )
    return true;
  if (
    isPatient(user) &&
    String(appointment.patient?._id || appointment.patient) === String(user.id)
  )
    return true;
  return false;
}

// ── Payment permissions ────────────────────────────────
export function canInitiatePayment(user) {
  return isPatient(user);
}

export function canConfirmPayment(user) {
  return isAdmin(user);
}

export function canViewPayment(user, payment) {
  if (!user || !payment) return false;
  if (isAdmin(user)) return true;
  if (
    isPatient(user) &&
    String(payment.patient?._id || payment.patient) === String(user.id)
  )
    return true;
  return false;
}

// ── Schedule permissions ───────────────────────────────
export function canEditSchedule(user, doctorId) {
  if (!user) return false;
  if (isAdmin(user)) return true;
  if (isDoctor(user) && String(user.id) === String(doctorId)) return true;
  return false;
}

// ── Medical record permissions ─────────────────────────
export function canViewMedicalRecord(user, record) {
  if (!user || !record) return false;
  if (isAdmin(user)) return true;
  if (
    isDoctor(user) &&
    String(record.doctor?._id || record.doctor) === String(user.id)
  )
    return true;
  if (
    isPatient(user) &&
    String(record.patient?._id || record.patient) === String(user.id) &&
    !record.isConfidential
  )
    return true;
  return false;
}

export function canCreateMedicalRecord(user) {
  return isDoctor(user) || isAdmin(user);
}

// ── Review permissions ─────────────────────────────────
export function canSubmitReview(user, appointment) {
  if (!user || !appointment) return false;
  return (
    isPatient(user) &&
    appointment.status === "completed" &&
    String(appointment.patient?._id || appointment.patient) === String(user.id)
  );
}

export function canModerateReview(user) {
  return isAdmin(user);
}

export function canRespondToReview(user, review) {
  if (!user || !review) return false;
  return (
    isDoctor(user) &&
    String(review.doctor?._id || review.doctor) === String(user.id)
  );
}

// ── Admin permissions ──────────────────────────────────
export function canManageUsers(user) {
  return isAdmin(user);
}
export function canViewReports(user) {
  return isAdmin(user);
}
export function canManageDepartments(user) {
  return isAdmin(user);
}
export function canManageHolidays(user) {
  return isAdmin(user);
}
export function canViewAuditLogs(user) {
  return isAdmin(user);
}
