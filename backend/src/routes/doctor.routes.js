// doctor.routes.js — Maps /api/doctors/* URLs to controller functions
import { Router } from "express";
import {
  getAllDoctors,
  getDoctorById,
  getSpecializations,
} from "../controllers/doctor.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/specializations/list", protect, getSpecializations);
router.get("/:id", protect, getDoctorById);
router.get("/", protect, getAllDoctors);

export default router;
