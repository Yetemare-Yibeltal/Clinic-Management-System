// Review.model.js — Patient reviews and ratings for doctors
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    // ── Who wrote the review ───────────────────────────
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ── Which doctor is being reviewed ─────────────────
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ── Which appointment this review is for ──────────
    // One review per appointment — prevents duplicate reviews
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
      unique: true,
    },

    // ── Rating (1-5 stars) ─────────────────────────────
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    // ── Individual rating categories ───────────────────
    ratings: {
      punctuality: { type: Number, min: 1, max: 5 },
      communication: { type: Number, min: 1, max: 5 },
      expertise: { type: Number, min: 1, max: 5 },
      friendliness: { type: Number, min: 1, max: 5 },
      cleanliness: { type: Number, min: 1, max: 5 },
    },

    // ── Review text ────────────────────────────────────
    comment: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    // ── Doctor response ────────────────────────────────
    doctorResponse: {
      type: String,
      trim: true,
      maxlength: 500,
      default: null,
    },
    doctorRespondedAt: {
      type: Date,
      default: null,
    },

    // ── Admin moderation ───────────────────────────────
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "flagged"],
      default: "pending",
    },
    moderatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    moderatedAt: {
      type: Date,
      default: null,
    },
    moderationNote: {
      type: String,
      default: null,
    },

    // ── Visibility ─────────────────────────────────────
    isVisible: {
      type: Boolean,
      default: false, // only visible after admin approves
    },

    // ── Helpful votes ──────────────────────────────────
    helpfulVotes: {
      type: Number,
      default: 0,
    },

    // ── Anonymous review option ────────────────────────
    isAnonymous: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// ── Indexes ────────────────────────────────────────────
reviewSchema.index({ doctor: 1 });
reviewSchema.index({ patient: 1 });
reviewSchema.index({ doctor: 1, status: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ createdAt: -1 });

// ── Static: calculate average rating for a doctor ─────
reviewSchema.statics.getAverageRating = async function (doctorId) {
  const result = await this.aggregate([
    {
      $match: {
        doctor: new mongoose.Types.ObjectId(doctorId),
        status: "approved",
        isVisible: true,
      },
    },
    {
      $group: {
        _id: "$doctor",
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
        ratingBreakdown: {
          $push: "$rating",
        },
      },
    },
  ]);

  if (result.length === 0) {
    return { averageRating: 0, totalReviews: 0 };
  }

  return {
    averageRating: Math.round(result[0].averageRating * 10) / 10,
    totalReviews: result[0].totalReviews,
  };
};

// ── Post-save: update doctor's average rating ─────────
reviewSchema.post("save", async function () {
  try {
    const Review = this.constructor;
    const { averageRating, totalReviews } = await Review.getAverageRating(
      this.doctor,
    );

    await mongoose.model("User").findByIdAndUpdate(this.doctor, {
      averageRating,
      totalReviews,
    });
  } catch (err) {
    console.error("Failed to update doctor average rating:", err.message);
  }
});

export default mongoose.model("Review", reviewSchema);
