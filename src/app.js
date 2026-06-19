// app.js — Express application: middleware and route mounting
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { ENV } from "./config/env.js";

const app = express();

// ── Core middleware ──────────────────────────────
app.use(
  cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Logging (only in development) ────────────────
if (ENV.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ── Health check ──────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    clinic: "Kidus Yared Healthcare",
    environment: ENV.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ── Routes will be mounted here in later steps ───
// app.use('/api/auth', authRoutes)
// app.use('/api/doctors', doctorRoutes)
// app.use('/api/appointments', appointmentRoutes)
// app.use('/api/schedules', scheduleRoutes)
// app.use('/api/reports', reportRoutes)

// ── 404 handler ───────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

export default app;
