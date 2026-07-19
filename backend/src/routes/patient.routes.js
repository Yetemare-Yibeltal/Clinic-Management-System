// patient.routes.js — Maps /api/patients/* URLs to controller
import { Router } from "express";
import {
  getMyProfile,
  updateMyProfile,
  getPatientById,
  getAllPatients,
  changePassword,
} from "../controllers/patient.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { validateUpdatePatient } from "../middleware/patient.validator.js";

const router = Router();

// Patient routes
router.get("/profile", protect, restrictTo("patient"), getMyProfile);

router.patch(
  "/profile",
  protect,
  restrictTo("patient"),
  validateUpdatePatient,
  validate,
  updateMyProfile,
);

router.patch(
  "/change-password",
  protect,
  restrictTo("patient"),
  changePassword,
);

// Admin routes
router.get("/", protect, restrictTo("admin"), getAllPatients);

router.get("/:id", protect, restrictTo("admin", "doctor"), getPatientById);

export default router;
