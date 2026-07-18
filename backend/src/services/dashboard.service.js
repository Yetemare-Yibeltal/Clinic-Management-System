// dashboard.service.js — KPI statistics for the admin dashboard
import Appointment from "../models/Appointment.model.js";
import Payment from "../models/Payment.model.js";
import User from "../models/User.model.js";
import Review from "../models/Review.model.js";
import { getDateRange } from "../utils/date.utils.js";

// ── Main dashboard stats ───────────────────────────────
// Returns all KPIs needed for the admin dashboard in one call
export async function getDashboardStats(period = "month") {
  const { start, end } = getDateRange(period);

  const [
    totalPatients,
    totalDoctors,
    totalAppointments,
    pendingAppointments,
    confirmedAppointments,
    cancelledAppointments,
    completedAppointments,
    totalRevenue,
    pendingPayments,
    newPatientsThisPeriod,
    appointmentsThisPeriod,
    revenueThisPeriod,
  ] = await Promise.all([
    User.countDocuments({ role: "patient", isActive: true }),
    User.countDocuments({ role: "doctor", isActive: true }),
    Appointment.countDocuments({}),
    Appointment.countDocuments({ status: "pending" }),
    Appointment.countDocuments({ status: "confirmed" }),
    Appointment.countDocuments({ status: "cancelled" }),
    Appointment.countDocuments({ status: "completed" }),

    // Total revenue from completed payments
    Payment.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),

    // Pending manual payments awaiting admin confirmation
    Payment.countDocuments({ status: "pending", method: { $ne: "chapa" } }),

    // New patients registered this period
    User.countDocuments({
      role: "patient",
      createdAt: { $gte: start, $lte: end },
    }),

    // Appointments this period
    Appointment.countDocuments({
      createdAt: { $gte: start, $lte: end },
    }),

    // Revenue this period
    Payment.aggregate([
      {
        $match: {
          status: "completed",
          createdAt: { $gte: start, $lte: end },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
  ]);

  return {
    overview: {
      totalPatients,
      totalDoctors,
      totalAppointments,
      totalRevenue: totalRevenue[0]?.total || 0,
    },
    appointments: {
      total: totalAppointments,
      pending: pendingAppointments,
      confirmed: confirmedAppointments,
      cancelled: cancelledAppointments,
      completed: completedAppointments,
    },
    payments: {
      pendingConfirmation: pendingPayments,
      revenueThisPeriod: revenueThisPeriod[0]?.total || 0,
    },
    period: {
      newPatients: newPatientsThisPeriod,
      appointments: appointmentsThisPeriod,
      revenue: revenueThisPeriod[0]?.total || 0,
      label: period,
    },
  };
}

// ── Today's appointments ───────────────────────────────
export async function getTodayAppointments() {
  const today = new Date().toISOString().split("T")[0];

  return Appointment.find({ date: today })
    .populate("patient", "firstName lastName phone")
    .populate("doctor", "firstName lastName specialization")
    .sort({ time: 1 });
}

// ── Top performing doctors ─────────────────────────────
export async function getTopDoctors(limit = 5) {
  return Appointment.aggregate([
    { $match: { status: "completed" } },
    {
      $group: {
        _id: "$doctor",
        totalPatients: { $sum: 1 },
      },
    },
    { $sort: { totalPatients: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "doctor",
      },
    },
    { $unwind: "$doctor" },
    {
      $project: {
        _id: "$doctor._id",
        firstName: "$doctor.firstName",
        lastName: "$doctor.lastName",
        specialization: "$doctor.specialization",
        averageRating: "$doctor.averageRating",
        totalPatients: 1,
      },
    },
  ]);
}

// ── Revenue by month ───────────────────────────────────
export async function getMonthlyRevenue(year = new Date().getFullYear()) {
  const result = await Payment.aggregate([
    {
      $match: {
        status: "completed",
        createdAt: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$createdAt" },
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Fill in missing months with 0
  const months = Array.from({ length: 12 }, (_, i) => {
    const found = result.find((r) => r._id === i + 1);
    return {
      month: i + 1,
      revenue: found?.total || 0,
      count: found?.count || 0,
    };
  });

  return months;
}

// ── Appointments by status for chart ──────────────────
export async function getAppointmentsByStatus() {
  return Appointment.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);
}

// ── Payment methods breakdown ──────────────────────────
export async function getPaymentMethodsBreakdown() {
  return Payment.aggregate([
    { $match: { status: "completed" } },
    {
      $group: {
        _id: "$method",
        count: { $sum: 1 },
        total: { $sum: "$amount" },
      },
    },
    { $sort: { total: -1 } },
  ]);
}
