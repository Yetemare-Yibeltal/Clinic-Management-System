// app.js — Express application: all middleware and routes mounted
import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { ENV } from "./config/env.js";
import { securityHeaders } from "./middleware/security.middleware.js";
import { sanitizeInput } from "./middleware/sanitize.middleware.js";
import { skipHealthCheck } from "./middleware/logger.middleware.js";

// ── Route imports ─────────────────────────────────────
import authRoutes from "./routes/auth.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import doctorRoutes from "./routes/doctor.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import scheduleRoutes from "./routes/schedule.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import medicalRecordRoutes from "./routes/medicalRecord.routes.js";
import departmentRoutes from "./routes/department.routes.js";
import patientRoutes from "./routes/patient.routes.js";
import reportRoutes from "./routes/report.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import searchRoutes from "./routes/search.routes.js";
import clinicSettingsRoutes from "./routes/clinicSettings.routes.js";
import holidayRoutes from "./routes/holiday.routes.js";
import { notFound, errorHandler } from "./middleware/error.middleware.js";

const app = express();

// ── Security headers ──────────────────────────────────
app.use(securityHeaders);

// ── CORS ──────────────────────────────────────────────
app.use(
  cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
  }),
);

// ── Raw body for Chapa webhook ────────────────────────
app.use("/api/payments/webhook", express.raw({ type: "application/json" }));

// ── Body parsers ──────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Input sanitization ────────────────────────────────
app.use(sanitizeInput);

// ── Request logging ───────────────────────────────────
if (ENV.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(skipHealthCheck);
}

// ── Static files (uploaded images) ───────────────────
app.use("/uploads", express.static(path.resolve("uploads")));

// ── Health check ──────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    clinic: "Kidus Yared Healthcare",
    environment: ENV.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ── API Routes ────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/medical-records", medicalRecordRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/clinic-settings", clinicSettingsRoutes);
app.use("/api/holidays", holidayRoutes);

// ── 404 + Error handling ──────────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;
