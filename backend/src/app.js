// app.js — Express application: middleware and route mounting
import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { ENV } from "./config/env.js";
import authRoutes from "./routes/auth.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import doctorRoutes from "./routes/doctor.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import scheduleRoutes from "./routes/schedule.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import { notFound, errorHandler } from "./middleware/error.middleware.js";

const app = express();

// ── Core middleware ──────────────────────────────────
app.use(
  cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
  }),
);

// Raw body parser for Chapa webhook signature verification
// Must be before express.json() for the webhook route
app.use("/api/payments/webhook", express.raw({ type: "application/json" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Logging (only in development) ────────────────────
if (ENV.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ── Serve uploaded files publicly ─────────────────────
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

// ── Routes ────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/payments", paymentRoutes);
// More routes will be mounted here in later phases:
// app.use('/api/reports',   reportRoutes)

// ── 404 + Error handling ──────────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;
