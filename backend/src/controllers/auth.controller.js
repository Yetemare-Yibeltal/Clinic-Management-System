// auth.controller.js — Register, Login, and Get Current User logic
import User from "../models/User.model.js";
import { signToken } from "../utils/jwt.js";

// Helper: build the response with token + safe user object
function buildAuthResponse(user) {
  const token = signToken({ id: user._id, role: user.role });

  const safeUser = {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    city: user.city,
    region: user.region,
    initials: user.initials,
    avatar: user.avatar,
    specialization: user.specialization,
    consultationFee: user.consultationFee,
  };

  return { token, user: safeUser };
}

// POST /api/auth/register
export async function register(req, res, next) {
  try {
    const { firstName, lastName, email, phone, password, role, city, region } =
      req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res
        .status(409)
        .json({ error: "An account with this email already exists." });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password,
      role: role || "patient",
      city: city || "Addis Ababa",
      region: region || "Addis Ababa",
    });

    res.status(201).json(buildAuthResponse(user));
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/login
export async function login(req, res, next) {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user || user.role !== role) {
      return res
        .status(401)
        .json({ error: "Invalid email, password, or role." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ error: "Invalid email, password, or role." });
    }

    if (!user.isActive) {
      return res
        .status(403)
        .json({ error: "This account has been deactivated." });
    }

    res.json(buildAuthResponse(user));
  } catch (err) {
    next(err);
  }
}

// GET /api/auth/me
export async function getMe(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    res.json(buildAuthResponse(user).user);
  } catch (err) {
    next(err);
  }
}
