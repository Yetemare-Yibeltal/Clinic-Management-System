// review.routes.js — Maps /api/reviews/* URLs to controller
import { Router } from "express";
import {
  submitReview,
  getDoctorReviews,
  getAllReviews,
  moderateReview,
  respondToReview,
  getMyReviews,
} from "../controllers/review.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  validateSubmitReview,
  validateDoctorResponse,
  validateModerateReview,
  validateGetReviews,
} from "../middleware/review.validator.js";

const router = Router();

// Patient submits a review
router.post(
  "/",
  protect,
  restrictTo("patient"),
  validateSubmitReview,
  validate,
  submitReview,
);

// Patient sees their own reviews
router.get("/my", protect, restrictTo("patient"), getMyReviews);

// Admin sees all reviews for moderation
router.get(
  "/",
  protect,
  restrictTo("admin"),
  validateGetReviews,
  validate,
  getAllReviews,
);

// Anyone can see approved reviews for a doctor
router.get("/doctor/:doctorId", protect, getDoctorReviews);

// Admin moderates a review
router.patch(
  "/:id/moderate",
  protect,
  restrictTo("admin"),
  validateModerateReview,
  validate,
  moderateReview,
);

// Doctor responds to a review
router.patch(
  "/:id/respond",
  protect,
  restrictTo("doctor"),
  validateDoctorResponse,
  validate,
  respondToReview,
);

export default router;
