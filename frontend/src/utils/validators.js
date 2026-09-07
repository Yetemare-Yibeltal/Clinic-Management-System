// validators.js — Client-side form validation functions

// ── Email ──────────────────────────────────────────────
export function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// ── Ethiopian phone number ─────────────────────────────
// Valid formats: +251911223344, 0911223344, 0911-223-344
export function isValidEthiopianPhone(phone) {
  if (!phone) return false;
  const cleaned = phone.replace(/[\s-]/g, "");
  const regex = /^(\+251|0)(9|7)\d{8}$/;
  return regex.test(cleaned);
}

// ── Password ───────────────────────────────────────────
export function isValidPassword(password) {
  return password && password.length >= 6;
}

export function getPasswordStrength(password) {
  if (!password) return { score: 0, label: "", color: "" };

  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const levels = [
    { score: 0, label: "", color: "" },
    { score: 1, label: "Weak", color: "bg-red-500" },
    { score: 2, label: "Fair", color: "bg-orange-500" },
    { score: 3, label: "Good", color: "bg-yellow-500" },
    { score: 4, label: "Strong", color: "bg-blue-500" },
    { score: 5, label: "Very Strong", color: "bg-green-500" },
  ];

  return levels[score] || levels[0];
}

// ── Date ───────────────────────────────────────────────
export function isValidDate(dateString) {
  if (!dateString) return false;
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

export function isFutureDate(dateString) {
  if (!dateString) return false;
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
}

export function isPastDate(dateString) {
  if (!dateString) return false;
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

// ── File ───────────────────────────────────────────────
export function isValidImageFile(file) {
  if (!file) return false;
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  return allowedTypes.includes(file.type);
}

export function isValidFileSize(file, maxMB = 5) {
  if (!file) return false;
  return file.size <= maxMB * 1024 * 1024;
}

// ── Required field ─────────────────────────────────────
export function isRequired(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  return true;
}

// ── Amount ─────────────────────────────────────────────
export function isValidAmount(amount) {
  const num = Number(amount);
  return !isNaN(num) && num > 0 && num <= 100000;
}

// ── Form validation ────────────────────────────────────
// Returns { valid: true } or { valid: false, errors: {} }
export function validateLoginForm({ email, password, role }) {
  const errors = {};
  if (!isValidEmail(email)) errors.email = "Valid email is required";
  if (!isValidPassword(password))
    errors.password = "Password must be at least 6 characters";
  if (!role) errors.role = "Please select your role";
  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateRegisterForm({
  firstName,
  lastName,
  email,
  phone,
  password,
  role,
}) {
  const errors = {};
  if (!isRequired(firstName)) errors.firstName = "First name is required";
  if (!isRequired(lastName)) errors.lastName = "Last name is required";
  if (!isValidEmail(email)) errors.email = "Valid email is required";
  if (!isValidEthiopianPhone(phone))
    errors.phone = "Valid Ethiopian phone number is required";
  if (!isValidPassword(password))
    errors.password = "Password must be at least 6 characters";
  if (!role) errors.role = "Please select your role";
  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateBookingForm({ doctorId, date, time }) {
  const errors = {};
  if (!doctorId) errors.doctorId = "Please select a doctor";
  if (!date || !isFutureDate(date))
    errors.date = "Please select a valid future date";
  if (!time) errors.time = "Please select a time slot";
  return { valid: Object.keys(errors).length === 0, errors };
}
