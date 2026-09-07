// errorMessages.js — User friendly error messages
export const ERROR_MESSAGES = {
  // ── Network errors ─────────────────────────────────
  NETWORK_ERROR:
    "Unable to connect to the server. Please check your internet connection.",
  SERVER_ERROR: "Something went wrong on our end. Please try again later.",
  TIMEOUT: "The request took too long. Please try again.",

  // ── Auth errors ────────────────────────────────────
  INVALID_CREDENTIALS: "Invalid email, password, or role. Please try again.",
  EMAIL_EXISTS: "An account with this email already exists.",
  UNAUTHORIZED: "You need to log in to access this page.",
  FORBIDDEN: "You do not have permission to perform this action.",
  SESSION_EXPIRED: "Your session has expired. Please log in again.",
  INVALID_TOKEN: "Invalid or expired link. Please request a new one.",

  // ── Appointment errors ─────────────────────────────
  SLOT_UNAVAILABLE:
    "This time slot is no longer available. Please choose another.",
  APPOINTMENT_NOT_FOUND: "Appointment not found.",
  CANNOT_CANCEL: "This appointment cannot be cancelled at this time.",

  // ── Payment errors ─────────────────────────────────
  PAYMENT_ALREADY_COMPLETED: "This appointment has already been paid.",
  PAYMENT_NOT_FOUND: "Payment record not found.",
  INVALID_PAYMENT_AMOUNT: "Invalid payment amount.",

  // ── Validation errors ──────────────────────────────
  REQUIRED_FIELD: "This field is required.",
  INVALID_EMAIL: "Please enter a valid email address.",
  INVALID_PHONE: "Please enter a valid Ethiopian phone number.",
  PASSWORD_TOO_SHORT: "Password must be at least 6 characters.",
  PASSWORDS_MISMATCH: "Passwords do not match.",

  // ── File errors ────────────────────────────────────
  FILE_TOO_LARGE: "File is too large. Maximum size is 5MB.",
  INVALID_FILE_TYPE: "Only JPG, PNG, and WEBP images are allowed.",

  // ── Generic ────────────────────────────────────────
  SOMETHING_WENT_WRONG: "Something went wrong. Please try again.",
  NOT_FOUND: "The requested resource was not found.",
};

export const getErrorMessage = (error) => {
  if (!error) return ERROR_MESSAGES.SOMETHING_WENT_WRONG;

  // Axios error with response
  if (error.response?.data?.error) {
    return error.response.data.error;
  }

  // Network error
  if (error.code === "ERR_NETWORK") {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }

  // Timeout
  if (error.code === "ECONNABORTED") {
    return ERROR_MESSAGES.TIMEOUT;
  }

  return error.message || ERROR_MESSAGES.SOMETHING_WENT_WRONG;
};
