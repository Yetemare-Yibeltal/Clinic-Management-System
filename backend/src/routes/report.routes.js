// report.routes.js — Maps /api/reports/* URLs to controller (admin only)
import { Router } from "express";
import {
  getDashboard,
  getTodayStats,
  getTopDoctorsReport,
  getMonthlyRevenueReport,
  getAppointmentStatusReport,
  getPaymentMethodsReport,
  getAppointmentReportData,
  getRevenueReportData,
  getDoctorReportData,
  getPatientReportData,
} from "../controllers/report.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  validateDashboardStats,
  validateDateRange,
  validateRevenueReport,
  validateDoctorReport,
} from "../middleware/report.validator.js";

const router = Router();

// All report routes are admin only
router.use(protect, restrictTo("admin"));

router.get("/dashboard", validateDashboardStats, validate, getDashboard);
router.get("/today", getTodayStats);
router.get("/top-doctors", getTopDoctorsReport);
router.get("/monthly-revenue", getMonthlyRevenueReport);
router.get("/appointments-status", getAppointmentStatusReport);
router.get("/payment-methods", getPaymentMethodsReport);
router.get(
  "/appointments",
  validateDateRange,
  validate,
  getAppointmentReportData,
);
router.get("/revenue", validateRevenueReport, validate, getRevenueReportData);
router.get("/doctors", validateDoctorReport, validate, getDoctorReportData);
router.get("/patients", validateDateRange, validate, getPatientReportData);

export default router;
