// exportUtils.js — Data export utilities for reports
// ── Convert array of objects to CSV string ─────────────
function arrayToCSV(data, headers) {
  if (!data || data.length === 0) return "";

  const headerRow = headers.map((h) => h.label).join(",");
  const rows = data.map((row) =>
    headers
      .map((h) => {
        const value = h.key.split(".").reduce((obj, key) => obj?.[key], row);
        const str = value === null || value === undefined ? "" : String(value);
        // Escape commas and quotes
        return str.includes(",") || str.includes('"')
          ? `"${str.replace(/"/g, '""')}"`
          : str;
      })
      .join(","),
  );

  return [headerRow, ...rows].join("\n");
}

// ── Download a string as a file ────────────────────────
function downloadFile(content, filename, mimeType = "text/csv") {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ── Export appointments to CSV ─────────────────────────
export function exportAppointmentsCSV(appointments) {
  const headers = [
    { label: "Date", key: "date" },
    { label: "Time", key: "time" },
    { label: "Patient", key: "patient.firstName" },
    { label: "Doctor", key: "doctor.firstName" },
    { label: "Type", key: "type" },
    { label: "Status", key: "status" },
    { label: "Fee (ETB)", key: "fee" },
    { label: "Paid", key: "isPaid" },
  ];

  const csv = arrayToCSV(appointments, headers);
  const filename = `appointments_${new Date().toISOString().split("T")[0]}.csv`;
  downloadFile(csv, filename);
}

// ── Export payments to CSV ─────────────────────────────
export function exportPaymentsCSV(payments) {
  const headers = [
    { label: "Date", key: "createdAt" },
    { label: "Patient", key: "patient.firstName" },
    { label: "Amount (ETB)", key: "amount" },
    { label: "Method", key: "method" },
    { label: "Status", key: "status" },
    { label: "Transaction", key: "chapaTxRef" },
  ];

  const csv = arrayToCSV(payments, headers);
  const filename = `payments_${new Date().toISOString().split("T")[0]}.csv`;
  downloadFile(csv, filename);
}

// ── Export doctors to CSV ──────────────────────────────
export function exportDoctorsCSV(doctors) {
  const headers = [
    { label: "First Name", key: "firstName" },
    { label: "Last Name", key: "lastName" },
    { label: "Specialization", key: "specialization" },
    { label: "Fee (ETB)", key: "consultationFee" },
    { label: "Rating", key: "averageRating" },
    { label: "Total Reviews", key: "totalReviews" },
    { label: "Available", key: "available" },
  ];

  const csv = arrayToCSV(doctors, headers);
  const filename = `doctors_${new Date().toISOString().split("T")[0]}.csv`;
  downloadFile(csv, filename);
}
