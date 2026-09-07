// helpers.js — General purpose helper functions

// ── Array helpers ──────────────────────────────────────
export function groupBy(array, key) {
  return array.reduce((groups, item) => {
    const group = item[key];
    if (!groups[group]) groups[group] = [];
    groups[group].push(item);
    return groups;
  }, {});
}

export function sortBy(array, key, direction = "asc") {
  return [...array].sort((a, b) => {
    if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
    if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
    return 0;
  });
}

export function uniqueBy(array, key) {
  const seen = new Set();
  return array.filter((item) => {
    const value = item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}

// ── Object helpers ─────────────────────────────────────
export function omit(obj, keys) {
  const result = { ...obj };
  keys.forEach((key) => delete result[key]);
  return result;
}

export function pick(obj, keys) {
  return keys.reduce((result, key) => {
    if (key in obj) result[key] = obj[key];
    return result;
  }, {});
}

export function isEmpty(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
}

// ── String helpers ─────────────────────────────────────
export function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function truncate(str, maxLength = 100) {
  if (!str) return "";
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}...`;
}

export function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// ── URL helpers ────────────────────────────────────────
export function buildQueryString(params) {
  const filtered = Object.entries(params).filter(
    ([, value]) => value !== null && value !== undefined && value !== "",
  );
  if (filtered.length === 0) return "";
  return (
    "?" + filtered.map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join("&")
  );
}

// ── Storage helpers ────────────────────────────────────
export function getFromStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeFromStorage(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

// ── Debounce ───────────────────────────────────────────
export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// ── Copy to clipboard ──────────────────────────────────
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

// ── Generate random ID ─────────────────────────────────
export function generateId() {
  return Math.random().toString(36).substring(2, 11);
}

// ── Sleep (for testing/delays) ─────────────────────────
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
