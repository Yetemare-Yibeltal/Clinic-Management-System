// clinicSettings.routes.js — Maps /api/clinic-settings/* URLs to controller
import { Router } from "express";
import {
  getClinicSettings,
  updateClinicSettings,
  getPaymentAccounts,
  updatePaymentAccounts,
} from "../controllers/clinicSettings.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";

const router = Router();

// Public — anyone can view basic clinic info
router.get("/", protect, getClinicSettings);

// Admin only
router.patch("/", protect, restrictTo("admin"), updateClinicSettings);
router.get(
  "/payment-accounts",
  protect,
  restrictTo("admin"),
  getPaymentAccounts,
);
router.patch(
  "/payment-accounts",
  protect,
  restrictTo("admin"),
  updatePaymentAccounts,
);

export default router;
