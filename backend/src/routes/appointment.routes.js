// appointment.routes.js — Maps /api/appointments/* URLs to controller functions
import { Router } from "express";
import { body } from "express-validator";
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  bulkUpdateStatus,
} from "../controllers/appointment.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

const router = Router();

// ── Validation rules ──────────────────────────────
const createRules = [
  body("doctorId").notEmpty().withMessage("Doctor is required"),
  body("date").notEmpty().withMessage("Date is required"),
  body("time").notEmpty().withMessage("Time slot is required"),
  body("type")
    .optional()
    .isIn(["consultation", "follow-up", "check-up", "emergency"]),
  body("visitMode").optional().isIn(["in-person", "video-call"]),
];

const statusRules = [
  body("status").isIn([
    "pending",
    "confirmed",
    "cancelled",
    "completed",
    "rescheduled",
  ]),
];

// ── Routes ──────────────────────────────────────────
router.post("/", protect, createRules, validate, createAppointment);
router.get("/", protect, getAppointments);
router.get("/:id", protect, getAppointmentById);
router.patch("/bulk-status", protect, restrictTo("admin"), bulkUpdateStatus);
router.patch(
  "/:id/status",
  protect,
  statusRules,
  validate,
  updateAppointmentStatus,
);

export default router;
