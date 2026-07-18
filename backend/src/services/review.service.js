// review.service.js — Review business logic and eligibility checks
import Review from "../models/Review.model.js";
import Appointment from "../models/Appointment.model.js";
import User from "../models/User.model.js";
import { logger } from "../config/logger.config.js";

// ── Check if patient can review an appointment ─────────
// Patient can only review if:
// 1. Appointment is completed
// 2. Appointment belongs to this patient
// 3. No review has been submitted yet for this appointment
export async function canPatientReview(appointmentId, patientId) {
  const appointment = await Appointment.findById(appointmentId);

  if (!appointment) {
    return { eligible: false, reason: "Appointment not found" };
  }

  if (String(appointment.patient) !== String(patientId)) {
    return {
      eligible: false,
      reason: "This appointment does not belong to you",
    };
  }

  if (appointment.status !== "completed") {
    return {
      eligible: false,
      reason: "You can only review completed appointments",
    };
  }

  const existingReview = await Review.findOne({ appointment: appointmentId });
  if (existingReview) {
    return {
      eligible: false,
      reason: "You have already reviewed this appointment",
    };
  }

  return { eligible: true, appointment };
}

// ── Update doctor average rating after review change ──
export async function updateDoctorRating(doctorId) {
  try {
    const result = await Review.aggregate([
      {
        $match: {
          doctor: doctorId,
          status: "approved",
          isVisible: true,
        },
      },
      {
        $group: {
          _id: "$doctor",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    const averageRating = result[0]
      ? Math.round(result[0].averageRating * 10) / 10
      : 0;
    const totalReviews = result[0]?.totalReviews || 0;

    await User.findByIdAndUpdate(doctorId, { averageRating, totalReviews });

    return { averageRating, totalReviews };
  } catch (err) {
    logger.error("Failed to update doctor rating:", err.message);
  }
}

// ── Get review statistics for a doctor ────────────────
export async function getDoctorReviewStats(doctorId) {
  const [stats, ratingBreakdown] = await Promise.all([
    Review.aggregate([
      {
        $match: {
          doctor: doctorId,
          status: "approved",
          isVisible: true,
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
          avgPunctuality: { $avg: "$ratings.punctuality" },
          avgCommunication: { $avg: "$ratings.communication" },
          avgExpertise: { $avg: "$ratings.expertise" },
          avgFriendliness: { $avg: "$ratings.friendliness" },
          avgCleanliness: { $avg: "$ratings.cleanliness" },
        },
      },
    ]),

    Review.aggregate([
      {
        $match: {
          doctor: doctorId,
          status: "approved",
          isVisible: true,
        },
      },
      { $group: { _id: "$rating", count: { $sum: 1 } } },
      { $sort: { _id: -1 } },
    ]),
  ]);

  return {
    stats: stats[0] || { averageRating: 0, totalReviews: 0 },
    ratingBreakdown,
  };
}
