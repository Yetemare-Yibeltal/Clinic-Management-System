// env.js — Centralized access to all environment variables
import dotenv from "dotenv";

dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  NODE_ENV: process.env.NODE_ENV || "development",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",

  // Chapa payment gateway (Ethiopian)
  CHAPA_SECRET_KEY: process.env.CHAPA_SECRET_KEY,
  CHAPA_BASE_URL: process.env.CHAPA_BASE_URL || "https://api.chapa.co/v1",
  CHAPA_WEBHOOK_SECRET: process.env.CHAPA_WEBHOOK_SECRET,
};
