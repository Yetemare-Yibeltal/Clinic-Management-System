// auth.routes.js — Maps /api/auth/* URLs to controller functions
import { Router } from "express";
import { body } from "express-validator";
import { register, login, getMe } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

const router = Router();

// ── Validation rules ──────────────────────────────
const registerRules = [
  body("firstName").trim().notEmpty().withMessage("First name is required"),
  body("lastName").trim().notEmpty().withMessage("Last name is required"),
  body("email").isEmail().withMessage("A valid email is required"),
  body("phone").notEmpty().withMessage("Phone number is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("role")
    .optional()
    .isIn(["patient", "doctor", "admin"])
    .withMessage("Invalid role"),
];

const loginRules = [
  body("email").isEmail().withMessage("A valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
  body("role")
    .isIn(["patient", "doctor", "admin"])
    .withMessage("Role is required"),
];

// ── Routes ──────────────────────────────────────────
router.post("/register", registerRules, validate, register);
router.post("/login", loginRules, validate, login);
router.get("/me", protect, getMe);

export default router;
