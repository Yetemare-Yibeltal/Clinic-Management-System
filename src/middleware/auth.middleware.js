// auth.middleware.js — Protect routes and restrict access by role
import { verifyToken } from "../utils/jwt.js";
import User from "../models/User.model.js";

// Require a valid JWT to access the route
export async function protect(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res
      .status(401)
      .json({ error: "Authentication required. Please log in." });
  }

  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return res
        .status(401)
        .json({ error: "User not found or account is deactivated." });
    }

    req.user = user;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ error: "Invalid or expired session. Please log in again." });
  }
}

// Restrict the route to specific roles only
export function restrictTo(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: "You do not have permission to perform this action.",
      });
    }
    next();
  };
}
