// User.model.js — Patients, Doctors and Admins for Kidus Yared Healthcare
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    // ── Personal info ──────────────────────────────
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, required: true },
    password: { type: String, required: true, minlength: 6, select: false },

    // ── Role ───────────────────────────────────────
    role: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      default: "patient",
    },

    // ── Location ───────────────────────────────────
    city: { type: String, default: "Addis Ababa" },
    region: { type: String, default: "Addis Ababa" },

    // ── Doctor-specific fields ─────────────────────
    specialization: { type: String },
    licenseNumber: { type: String },
    experienceYears: { type: Number },
    bio: { type: String },
    available: { type: Boolean, default: true },
    consultationFee: { type: Number, default: 500 }, // Ethiopian Birr (ETB)

    // ── Profile ────────────────────────────────────
    avatar: { type: String, default: "" },
    initials: { type: String },

    // ── Status ─────────────────────────────────────
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

// Hash password before saving + auto-generate initials
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  if (this.firstName && this.lastName) {
    this.initials = (this.firstName[0] + this.lastName[0]).toUpperCase();
  }

  next();
});

// Compare entered password with hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
