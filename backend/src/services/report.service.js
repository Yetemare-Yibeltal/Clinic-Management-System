// report.service.js — Report generation for the analytics page
import Appointment from "../models/Appointment.model.js";
import Payment from "../models/Payment.model.js";
import User from "../models/User.model.js";
import Review from "../models/Review.model.js";
import { getDateRange } from "../utils/date.utils.js";

// ── Appointment report ─────────────────────────────────
export async function getAppointmentReport({ range, startDate, endDate }) {
  const { start, end } = getDateRange(range, startDate, endDate);

  const [total, byStatus, byType, byVisitMode, byDay, cancellationRate] =
    await Promise.all([
      // Total count
      Appointment.countDocuments({
        createdAt: { $gte: start, $lte: end },
      }),

      // By status
      Appointment.aggregate([
        { $match: { createdAt: { $gte: start, $lte: end } } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),

      // By type
      Appointment.aggregate([
        { $match: { createdAt: { $gte: start, $lte: end } } },
        { $group: { _id: "$type", count: { $sum: 1 } } },
      ]),

      // By visit mode
      Appointment.aggregate([
        { $match: { createdAt: { $gte: start, $lte: end } } },
        { $group: { _id: "$visitMode", count: { $sum: 1 } } },
      ]),

      // By day of week
      Appointment.aggregate([
        { $match: { createdAt: { $gte: start, $lte: end } } },
        {
          $group: {
            _id: { $dayOfWeek: "$createdAt" },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      // Cancellation rate
      Appointment.aggregate([
        { $match: { createdAt: { $gte: start, $lte: end } } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            cancelled: {
              $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] },
            },
          },
        },
      ]),
    ]);

  const rate = cancellationRate[0]
    ? ((rate?.cancelled / rate?.total) * 100).toFixed(1)
    : 0;

  return {
    total,
    byStatus,
    byType,
    byVisitMode,
    byDay,
    cancellationRate: Number(rate),
    period: { start, end, range },
  };
}

// ── Revenue report ─────────────────────────────────────
export async function getRevenueReport({
  range,
  startDate,
  endDate,
  groupBy = "day",
}) {
  const { start, end } = getDateRange(range, startDate, endDate);

  const groupByField = {
    day: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
    week: { $week: "$createdAt" },
    month: { $month: "$createdAt" },
  }[groupBy] || { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };

  const [totalRevenue, revenueByPeriod, revenueByMethod, averagePayment] =
    await Promise.all([
      Payment.aggregate([
        {
          $match: {
            status: "completed",
            createdAt: { $gte: start, $lte: end },
          },
        },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),

      Payment.aggregate([
        {
          $match: {
            status: "completed",
            createdAt: { $gte: start, $lte: end },
          },
        },
        {
          $group: {
            _id: groupByField,
            total: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      Payment.aggregate([
        {
          $match: {
            status: "completed",
            createdAt: { $gte: start, $lte: end },
          },
        },
        {
          $group: {
            _id: "$method",
            total: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
        { $sort: { total: -1 } },
      ]),

      Payment.aggregate([
        {
          $match: {
            status: "completed",
            createdAt: { $gte: start, $lte: end },
          },
        },
        { $group: { _id: null, avg: { $avg: "$amount" } } },
      ]),
    ]);

  return {
    totalRevenue: totalRevenue[0]?.total || 0,
    averagePayment: Math.round(averagePayment[0]?.avg || 0),
    revenueByPeriod,
    revenueByMethod,
    period: { start, end, range, groupBy },
  };
}

// ── Doctor performance report ──────────────────────────
export async function getDoctorPerformanceReport({
  range,
  startDate,
  endDate,
  doctorId,
}) {
  const { start, end } = getDateRange(range, startDate, endDate);

  const matchFilter = {
    createdAt: { $gte: start, $lte: end },
  };
  if (doctorId) matchFilter.doctor = doctorId;

  const [appointmentsByDoctor, revenueByDoctor, ratingsByDoctor] =
    await Promise.all([
      Appointment.aggregate([
        { $match: matchFilter },
        {
          $group: {
            _id: "$doctor",
            total: { $sum: 1 },
            completed: {
              $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
            },
            cancelled: {
              $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] },
            },
          },
        },
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
            name: { $concat: ["$doctor.firstName", " ", "$doctor.lastName"] },
            specialization: "$doctor.specialization",
            total: 1,
            completed: 1,
            cancelled: 1,
          },
        },
        { $sort: { total: -1 } },
      ]),

      Payment.aggregate([
        {
          $match: {
            status: "completed",
            createdAt: { $gte: start, $lte: end },
          },
        },
        { $group: { _id: "$doctor", revenue: { $sum: "$amount" } } },
      ]),

      Review.aggregate([
        {
          $match: { status: "approved", createdAt: { $gte: start, $lte: end } },
        },
        {
          $group: {
            _id: "$doctor",
            avgRating: { $avg: "$rating" },
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

  return {
    appointmentsByDoctor,
    revenueByDoctor,
    ratingsByDoctor,
    period: { start, end, range },
  };
}

// ── Patient statistics report ──────────────────────────
export async function getPatientReport({ range, startDate, endDate }) {
  const { start, end } = getDateRange(range, startDate, endDate);

  const [
    newPatients,
    totalPatients,
    patientsByCity,
    patientsByGender,
    repeatPatients,
  ] = await Promise.all([
    User.countDocuments({
      role: "patient",
      createdAt: { $gte: start, $lte: end },
    }),

    User.countDocuments({ role: "patient" }),

    User.aggregate([
      { $match: { role: "patient" } },
      { $group: { _id: "$city", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),

    User.aggregate([
      { $match: { role: "patient", gender: { $ne: null } } },
      { $group: { _id: "$gender", count: { $sum: 1 } } },
    ]),

    Appointment.aggregate([
      { $group: { _id: "$patient", count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } },
      { $count: "repeatPatients" },
    ]),
  ]);

  return {
    newPatients,
    totalPatients,
    patientsByCity,
    patientsByGender,
    repeatPatients: repeatPatients[0]?.repeatPatients || 0,
    period: { start, end, range },
  };
}
