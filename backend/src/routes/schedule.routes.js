// schedule.routes.js — Maps /api/schedules/* URLs to controller functions
import { Router } from "express";
import { body } from "express-validator";
import {
  getSchedule,
  saveSchedule,
  updateSlot,
} from "../controllers/schedule.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

const router = Router();

// ── Validation rules ──────────────────────────────
const slotRules = [
  body("day").notEmpty().withMessage("day is required"),
  body("slot").notEmpty().withMessage("slot is required"),
];

// ── Routes ────────────────────────────────────────
// Any logged-in user can view a doctor's schedule
router.get("/:doctorId", protect, getSchedule);

// Only doctors and admins can save or modify a schedule
router.put("/:doctorId", protect, restrictTo("doctor", "admin"), saveSchedule);
router.patch(
  "/:doctorId/slot",
  protect,
  restrictTo("doctor", "admin"),
  slotRules,
  validate,
  updateSlot,
);

export default router;
