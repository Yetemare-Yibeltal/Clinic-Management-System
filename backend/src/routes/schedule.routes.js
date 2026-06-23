// schedule.routes.js — Maps /api/schedules/* URLs to controller functions
import { Router } from "express";
import {
  getSchedule,
  saveSchedule,
  updateSlot,
} from "../controllers/schedule.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  validateDoctorId,
  validateWeeklyGrid,
  validateSlotUpdate,
} from "../middleware/schedule.validator.js";

const router = Router();

// Any logged-in user can view a doctor's schedule
router.get("/:doctorId", protect, validateDoctorId, validate, getSchedule);

// Only doctors and admins can save a full weekly schedule
router.put(
  "/:doctorId",
  protect,
  restrictTo("doctor", "admin"),
  validateWeeklyGrid,
  validate,
  saveSchedule,
);

// Only doctors and admins can toggle a single slot
router.patch(
  "/:doctorId/slot",
  protect,
  restrictTo("doctor", "admin"),
  validateSlotUpdate,
  validate,
  updateSlot,
);

export default router;
