// usePermissions.js — Role-based permission hook
import useAuthStore from "../store/authStore.js";
import {
  isAdmin,
  isDoctor,
  isPatient,
  canBookAppointment,
  canConfirmAppointment,
  canCancelAppointment,
  canViewAppointment,
  canInitiatePayment,
  canConfirmPayment,
  canViewPayment,
  canEditSchedule,
  canViewMedicalRecord,
  canCreateMedicalRecord,
  canSubmitReview,
  canModerateReview,
  canRespondToReview,
  canManageUsers,
  canViewReports,
  canManageDepartments,
  canManageHolidays,
  canViewAuditLogs,
} from "../utils/permissions.js";

export function usePermissions() {
  const { user } = useAuthStore();

  return {
    // ── Role checks ────────────────────────────────────
    isAdmin: isAdmin(user),
    isDoctor: isDoctor(user),
    isPatient: isPatient(user),

    // ── Appointment permissions ────────────────────────
    canBook: canBookAppointment(user),
    canConfirmAppointment: canConfirmAppointment(user),
    canCancel: (appointment) => canCancelAppointment(user, appointment),
    canViewAppointment: (appointment) => canViewAppointment(user, appointment),

    // ── Payment permissions ────────────────────────────
    canPay: canInitiatePayment(user),
    canConfirmPayment: canConfirmPayment(user),
    canViewPayment: (payment) => canViewPayment(user, payment),

    // ── Schedule permissions ───────────────────────────
    canEditSchedule: (doctorId) => canEditSchedule(user, doctorId),

    // ── Medical record permissions ─────────────────────
    canViewRecord: (record) => canViewMedicalRecord(user, record),
    canCreateRecord: canCreateMedicalRecord(user),

    // ── Review permissions ─────────────────────────────
    canReview: (appointment) => canSubmitReview(user, appointment),
    canModerate: canModerateReview(user),
    canRespondReview: (review) => canRespondToReview(user, review),

    // ── Admin permissions ──────────────────────────────
    canManageUsers: canManageUsers(user),
    canViewReports: canViewReports(user),
    canManageDepartments: canManageDepartments(user),
    canManageHolidays: canManageHolidays(user),
    canViewAuditLogs: canViewAuditLogs(user),
  };
}
