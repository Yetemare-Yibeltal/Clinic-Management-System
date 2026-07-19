// medicalRecord.routes.js — Maps /api/medical-records/* URLs to controller
import { Router } from "express";
import {
  createMedicalRecord,
  getMedicalRecords,
  getMedicalRecordById,
  updateMedicalRecord,
  getPatientSummary,
} from "../controllers/medicalRecord.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  validateCreateMedicalRecord,
  validateUpdateMedicalRecord,
  validateGetMedicalRecords,
} from "../middleware/medicalRecord.validator.js";

const router = Router();

// Create medical record (doctor or admin only)
router.post(
  "/",
  protect,
  restrictTo("doctor", "admin"),
  validateCreateMedicalRecord,
  validate,
  createMedicalRecord,
);

// Get all records (role-scoped)
router.get(
  "/",
  protect,
  validateGetMedicalRecords,
  validate,
  getMedicalRecords,
);

// Get patient health summary
router.get("/patient/:patientId/summary", protect, getPatientSummary);

// Get single record
router.get("/:id", protect, getMedicalRecordById);

// Update record (doctor or admin only)
router.patch(
  "/:id",
  protect,
  restrictTo("doctor", "admin"),
  validateUpdateMedicalRecord,
  validate,
  updateMedicalRecord,
);

export default router;
