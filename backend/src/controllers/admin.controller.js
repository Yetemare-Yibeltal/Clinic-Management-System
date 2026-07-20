// admin.controller.js — Admin-only system management operations
import User from "../models/User.model.js";
import AuditLog from "../models/AuditLog.model.js";
import Appointment from "../models/Appointment.model.js";
import Payment from "../models/Payment.model.js";
import { generateTemporaryPassword } from "../utils/password.utils.js";
import { logUserAction } from "../services/audit.service.js";

// GET /api/admin/users
export async function getAllUsers(req, res, next) {
  try {
    const { role, isActive, q, page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const filter = {};
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === "true";
    if (q) {
      filter.$or = [
        { firstName: { $regex: q, $options: "i" } },
        { lastName: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { phone: { $regex: q, $options: "i" } },
      ];
    }
    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-password -passwordResetToken -passwordResetExpires")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      User.countDocuments(filter),
    ]);
    res.json({
      users,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/users/:id
export async function getUserById(req, res, next) {
  try {
    const user = await User.findById(req.params.id).select(
      "-password -passwordResetToken -passwordResetExpires",
    );
    if (!user) return res.status(404).json({ error: "User not found." });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

// PATCH /api/admin/users/:id/status
export async function updateUserStatus(req, res, next) {
  try {
    const { isActive } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found." });
    if (String(user._id) === String(req.user._id)) {
      return res
        .status(400)
        .json({ error: "You cannot deactivate your own account." });
    }
    user.isActive = isActive;
    await user.save();
    await logUserAction(
      isActive ? "user_activated" : "user_deactivated",
      req.user,
      user,
      req,
      { isActive },
    );
    res.json({
      message: `User account ${isActive ? "activated" : "deactivated"} successfully.`,
      user: { id: user._id, email: user.email, isActive: user.isActive },
    });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/admin/users/:id/role
export async function changeUserRole(req, res, next) {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found." });
    if (String(user._id) === String(req.user._id)) {
      return res
        .status(400)
        .json({ error: "You cannot change your own role." });
    }
    const previousRole = user.role;
    user.role = role;
    await user.save();
    await logUserAction("user_updated", req.user, user, req, {
      previousRole,
      newRole: role,
    });
    res.json({
      message: `User role changed from ${previousRole} to ${role}.`,
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/admin/users/:id/reset-password
export async function adminResetUserPassword(req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found." });
    const tempPassword = generateTemporaryPassword();
    user.password = tempPassword;
    await user.save();
    await logUserAction("password_reset", req.user, user, req);
    res.json({
      message: "Password reset successfully.",
      temporaryPassword: tempPassword,
      userEmail: user.email,
    });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/admin/users/:id
export async function deleteUser(req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found." });
    if (String(user._id) === String(req.user._id)) {
      return res
        .status(400)
        .json({ error: "You cannot delete your own account." });
    }
    user.isActive = false;
    user.email = `deleted_${Date.now()}_${user.email}`;
    await user.save();
    await logUserAction("user_deleted", req.user, user, req);
    res.json({
      message: "User account deactivated and anonymized successfully.",
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/audit-logs
export async function getAuditLogs(req, res, next) {
  try {
    const { action, userId, page = 1, limit = 50 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const filter = {};
    if (action) filter.action = action;
    if (userId) filter.user = userId;
    const [logs, total] = await Promise.all([
      AuditLog.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate("user", "firstName lastName email role"),
      AuditLog.countDocuments(filter),
    ]);
    res.json({
      logs,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/admin/system-stats
export async function getSystemStats(req, res, next) {
  try {
    const [
      totalUsers,
      totalDoctors,
      totalPatients,
      totalAppointments,
      pendingPayments,
    ] = await Promise.all([
      User.countDocuments({ isActive: true }),
      User.countDocuments({ role: "doctor", isActive: true }),
      User.countDocuments({ role: "patient", isActive: true }),
      Appointment.countDocuments({}),
      Payment.countDocuments({ status: "pending" }),
    ]);
    res.json({
      totalUsers,
      totalDoctors,
      totalPatients,
      totalAppointments,
      pendingPayments,
    });
  } catch (err) {
    next(err);
  }
}
