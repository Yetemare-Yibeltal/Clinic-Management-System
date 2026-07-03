// User.model.js — Patients, Doctors and Admins for Kidus Yared Healthcare
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    // ── Personal info ──────────────────────────────────
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    // ── Role ───────────────────────────────────────────
    role: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      default: "patient",
    },

    // ── Location ───────────────────────────────────────
    city: {
      type: String,
      default: "Addis Ababa",
    },
    region: {
      type: String,
      default: "Addis Ababa",
    },
    subCity: {
      type: String,
      default: "",
    },
    woreda: {
      type: String,
      default: "",
    },

    // ── Doctor specific fields ─────────────────────────
    specialization: { type: String },
    licenseNumber: { type: String },
    experienceYears: { type: Number },
    bio: { type: String },
    available: { type: Boolean, default: true },
    consultationFee: { type: Number, default: 500 },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },

    // ── Doctor ratings (updated automatically by Review model) ──
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },

    // ── Patient specific fields ────────────────────────
    dateOfBirth: { type: Date },
    gender: {
      type: String,
      enum: ["male", "female", "other", null],
      default: null,
    },
    bloodType: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", null],
      default: null,
    },
    allergies: { type: String, default: "" },
    emergencyContact: {
      name: { type: String },
      phone: { type: String },
      relationship: { type: String },
    },

    // ── Profile ────────────────────────────────────────
    avatar: { type: String, default: "" },
    initials: { type: String },

    // ── Password reset ─────────────────────────────────
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },

    // ── Status ─────────────────────────────────────────
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    lastLogin: { type: Date },
  },
  {
    timestamps: true,
  },
);

// ── Indexes ────────────────────────────────────────────
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ specialization: 1 });
userSchema.index({ available: 1 });
userSchema.index({ averageRating: -1 });

// ── Hash password before saving ────────────────────────
userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  if (this.firstName && this.lastName) {
    this.initials = (this.firstName[0] + this.lastName[0]).toUpperCase();
  }
});

// ── Compare entered password with hashed password ─────
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// ── Virtual: full name ─────────────────────────────────
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// ── Virtual: is doctor? ────────────────────────────────
userSchema.virtual("isDoctor").get(function () {
  return this.role === "doctor";
});

// ── Virtual: is patient? ───────────────────────────────
userSchema.virtual("isPatient").get(function () {
  return this.role === "patient";
});

// ── Virtual: is admin? ─────────────────────────────────
userSchema.virtual("isAdmin").get(function () {
  return this.role === "admin";
});

export default mongoose.model("User", userSchema);
