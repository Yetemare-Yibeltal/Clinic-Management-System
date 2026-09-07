// imageUtils.js — Image handling utilities
const BASE_URL =
  import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

// ── Build full URL for uploaded images ────────────────
export function getImageUrl(path) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${BASE_URL}${path}`;
}

// ── Get avatar URL or null (to show initials instead) ─
export function getAvatarUrl(user) {
  if (!user?.avatar) return null;
  return getImageUrl(user.avatar);
}

// ── Create a local preview URL for a file ─────────────
export function createPreviewUrl(file) {
  if (!file) return null;
  return URL.createObjectURL(file);
}

// ── Revoke a preview URL to free memory ───────────────
export function revokePreviewUrl(url) {
  if (url) URL.revokeObjectURL(url);
}

// ── Validate an image file ─────────────────────────────
export function validateImageFile(file) {
  const errors = [];
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    errors.push("Only JPG, PNG and WEBP images are allowed");
  }

  if (file.size > maxSize) {
    errors.push("Image must be smaller than 5MB");
  }

  return { valid: errors.length === 0, errors };
}

// ── Get initials background color from name ────────────
// Consistent color based on name — same person always gets same color
export function getInitialsColor(name = "") {
  const colors = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-green-500",
    "bg-red-500",
    "bg-yellow-500",
    "bg-indigo-500",
    "bg-pink-500",
    "bg-teal-500",
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}
