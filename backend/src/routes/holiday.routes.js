// holiday.routes.js — Maps /api/holidays/* URLs to controller
import { Router } from "express";
import {
  createHoliday,
  getHolidays,
  checkHoliday,
  updateHoliday,
  deleteHoliday,
} from "../controllers/holiday.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";

const router = Router();

// Anyone logged in can view holidays and check dates
router.get("/", protect, getHolidays);
router.get("/check", protect, checkHoliday);

// Admin only
router.post("/", protect, restrictTo("admin"), createHoliday);
router.patch("/:id", protect, restrictTo("admin"), updateHoliday);
router.delete("/:id", protect, restrictTo("admin"), deleteHoliday);

export default router;
