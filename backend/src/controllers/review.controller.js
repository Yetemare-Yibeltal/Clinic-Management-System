// review.controller.js — Patient reviews and doctor ratings
import Review from "../models/Review.model.js";
import {
  canPatientReview,
  updateDoctorRating,
  getDoctorReviewStats,
} from "../services/review.service.js";
import { sendReviewReceivedEmail } from "../services/email.service.js";
import { notifyDoctorReviewReceived } from "../services/notification.service.js";
import User from "../models/User.model.js";

// POST /api/reviews
// Patient submits a review for a completed appointment
export async function submitReview(req, res, next) {
  try {
    const { appointmentId, rating, comment, ratings, isAnonymous } = req.body;

    const patientId = req.user._id;

    // Check eligibility
    const { eligible, reason, appointment } = await canPatientReview(
      appointmentId,
      patientId,
    );

    if (!eligible) {
      return res.status(400).json({ error: reason });
    }

    const review = await Review.create({
      patient: patientId,
      doctor: appointment.doctor,
      appointment: appointmentId,
      rating,
      comment: comment || "",
      ratings: ratings || {},
      isAnonymous: isAnonymous || false,
      status: "pending",
      isVisible: false,
    });

    // Notify doctor via email and in-app notification
    const doctor = await User.findById(appointment.doctor).select(
      "firstName lastName email",
    );

    if (doctor) {
      await sendReviewReceivedEmail(doctor, review);
      await notifyDoctorReviewReceived(review, doctor._id);
    }

    res.status(201).json({
      message:
        "Review submitted successfully. It will be visible after admin approval.",
      review,
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/reviews/doctor/:doctorId
// Get all approved and visible reviews for a doctor
export async function getDoctorReviews(req, res, next) {
  try {
    const { doctorId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const doctor = await User.findOne({ _id: doctorId, role: "doctor" }).select(
      "firstName lastName specialization averageRating totalReviews",
    );

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found." });
    }

    const [reviews, total, stats] = await Promise.all([
      Review.find({
        doctor: doctorId,
        status: "approved",
        isVisible: true,
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate("patient", "firstName lastName initials avatar"),

      Review.countDocuments({
        doctor: doctorId,
        status: "approved",
        isVisible: true,
      }),

      getDoctorReviewStats(doctorId),
    ]);

    // Hide patient name if review is anonymous
    const safeReviews = reviews.map((review) => {
      const r = review.toObject();
      if (r.isAnonymous) {
        r.patient = {
          firstName: "Anonymous",
          lastName: "Patient",
          initials: "AP",
        };
      }
      return r;
    });

    res.json({
      doctor,
      reviews: safeReviews,
      stats,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/reviews (admin only)
// Get all reviews with filters for moderation
export async function getAllReviews(req, res, next) {
  try {
    const { status, doctorId, page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter = {};
    if (status) filter.status = status;
    if (doctorId) filter.doctor = doctorId;

    const [reviews, total] = await Promise.all([
      Review.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate("patient", "firstName lastName email")
        .populate("doctor", "firstName lastName specialization")
        .populate("appointment", "date time"),
      Review.countDocuments(filter),
    ]);

    res.json({
      reviews,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/reviews/:id/moderate (admin only)
// Admin approves or rejects a review
export async function moderateReview(req, res, next) {
  try {
    const { status, moderationNote } = req.body;
    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ error: "Review not found." });
    }

    review.status = status;
    review.isVisible = status === "approved";
    review.moderatedBy = req.user._id;
    review.moderatedAt = new Date();
    review.moderationNote = moderationNote || null;

    await review.save();

    // Update doctor's average rating after approval/rejection
    await updateDoctorRating(review.doctor);

    res.json({
      message: `Review ${status} successfully.`,
      review,
    });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/reviews/:id/respond (doctor only)
// Doctor responds to a review
export async function respondToReview(req, res, next) {
  try {
    const { doctorResponse } = req.body;
    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ error: "Review not found." });
    }

    // Only the reviewed doctor can respond
    if (String(review.doctor) !== String(req.user._id)) {
      return res
        .status(403)
        .json({ error: "You can only respond to your own reviews." });
    }

    review.doctorResponse = doctorResponse;
    review.doctorRespondedAt = new Date();
    await review.save();

    res.json({
      message: "Response added successfully.",
      review,
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/reviews/my
// Patient gets their own submitted reviews
export async function getMyReviews(req, res, next) {
  try {
    const reviews = await Review.find({ patient: req.user._id })
      .sort({ createdAt: -1 })
      .populate("doctor", "firstName lastName specialization avatar")
      .populate("appointment", "date time");

    res.json(reviews);
  } catch (err) {
    next(err);
  }
}
