// admin.routes.js — Maps /api/admin/* URLs to controller (admin only)
import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  updateUserStatus,
  changeUserRole,
  adminResetUserPassword,
  deleteUser,
  getAuditLogs,
  getSystemStats,
} from "../controllers/admin.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  validateGetUsers,
  validateUpdateUserStatus,
  validateChangeUserRole,
  validateAdminResetPassword,
  validateDeleteUser,
} from "../middleware/admin.validator.js";

const router = Router();

// All admin routes require admin role
router.use(protect, restrictTo("admin"));

router.get("/users", validateGetUsers, validate, getAllUsers);
router.get("/users/:id", getUserById);
router.patch(
  "/users/:id/status",
  validateUpdateUserStatus,
  validate,
  updateUserStatus,
);
router.patch(
  "/users/:id/role",
  validateChangeUserRole,
  validate,
  changeUserRole,
);
router.patch(
  "/users/:id/reset-password",
  validateAdminResetPassword,
  validate,
  adminResetUserPassword,
);
router.delete("/users/:id", validateDeleteUser, validate, deleteUser);
router.get("/audit-logs", getAuditLogs);
router.get("/system-stats", getSystemStats);

export default router;
