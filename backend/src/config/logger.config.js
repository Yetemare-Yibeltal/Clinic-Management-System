// logger.config.js — Winston logger for server activity tracking
import { createLogger, format, transports } from "winston";
import { ENV } from "./env.js";

const { combine, timestamp, printf, colorize, errors } = format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

const devFormat = combine(
  colorize(),
  timestamp({ format: "HH:mm:ss" }),
  errors({ stack: true }),
  logFormat,
);

const prodFormat = combine(timestamp(), errors({ stack: true }), format.json());

export const logger = createLogger({
  level: ENV.NODE_ENV === "production" ? "warn" : "debug",
  format: ENV.NODE_ENV === "production" ? prodFormat : devFormat,
  transports: [
    new transports.Console(),
    new transports.File({ filename: "logs/error.log", level: "error" }),
    new transports.File({ filename: "logs/combined.log" }),
  ],
  exitOnError: false,
});

export default logger;
