// audit.service.js — Records system actions to audit log
import AuditLog from "../models/AuditLog.model.js";
import { logger } from "../config/logger.config.js";

// ── Create an audit log entry ──────────────────────────
export async function createAuditLog({
  userId,
  userRole,
  userEmail,
  action,
  resourceType = null,
  resourceId = null,
  ipAddress = null,
  userAgent = null,
  method = null,
  endpoint = null,
  previousData = null,
  newData = null,
  description = null,
  status = "success",
  errorMessage = null,
}) {
  try {
    await AuditLog.create({
      user: userId,
      userRole,
      userEmail,
      action,
      resourceType,
      resourceId,
      ipAddress,
      userAgent,
      method,
      endpoint,
      previousData,
      newData,
      description,
      status,
      errorMessage,
    });
  } catch (err) {
    // Never throw — audit logging should never break the main flow
    logger.error("Failed to create audit log:", err.message);
  }
}

// ── Extract request info for audit logs ───────────────
export function extractRequestInfo(req) {
  return {
    ipAddress: req.ip || req.connection?.remoteAddress || null,
    userAgent: req.headers["user-agent"] || null,
    method: req.method,
    endpoint: req.originalUrl,
  };
}

// ── Log user login ─────────────────────────────────────
export async function logLogin(user, req) {
  await createAuditLog({
    userId: user._id,
    userRole: user.role,
    userEmail: user.email,
    action: "login",
    description: `${user.role} logged in`,
    ...extractRequestInfo(req),
  });
}

// ── Log user logout ────────────────────────────────────
export async function logLogout(user, req) {
  await createAuditLog({
    userId: user._id,
    userRole: user.role,
    userEmail: user.email,
    action: "logout",
    description: `${user.role} logged out`,
    ...extractRequestInfo(req),
  });
}

// ── Log appointment action ─────────────────────────────
export async function logAppointmentAction(action, user, appointment, req) {
  await createAuditLog({
    userId: user._id,
    userRole: user.role,
    userEmail: user.email,
    action,
    resourceType: "appointment",
    resourceId: appointment._id,
    description: `${user.role} ${action} appointment ${appointment._id}`,
    ...extractRequestInfo(req),
  });
}

// ── Log payment action ─────────────────────────────────
export async function logPaymentAction(action, user, payment, req) {
  await createAuditLog({
    userId: user._id,
    userRole: user.role,
    userEmail: user.email,
    action,
    resourceType: "payment",
    resourceId: payment._id,
    description: `${user.role} ${action} payment ${payment._id}`,
    ...extractRequestInfo(req),
  });
}

// ── Log user management action ─────────────────────────
export async function logUserAction(
  action,
  adminUser,
  targetUser,
  req,
  changes = null,
) {
  await createAuditLog({
    userId: adminUser._id,
    userRole: adminUser.role,
    userEmail: adminUser.email,
    action,
    resourceType: "user",
    resourceId: targetUser._id,
    newData: changes,
    description: `Admin ${action} user ${targetUser.email}`,
    ...extractRequestInfo(req),
  });
}

// ── Log settings change ────────────────────────────────
export async function logSettingsChange(user, previousData, newData, req) {
  await createAuditLog({
    userId: user._id,
    userRole: user.role,
    userEmail: user.email,
    action: "clinic_settings_updated",
    resourceType: "clinic_settings",
    previousData,
    newData,
    description: "Admin updated clinic settings",
    ...extractRequestInfo(req),
  });
}
