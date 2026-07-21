// report.controller.js — Report API endpoints for admin analytics
import {
  getAppointmentReport,
  getRevenueReport,
  getDoctorPerformanceReport,
  getPatientReport,
} from "../services/report.service.js";
import {
  getDashboardStats,
  getTodayAppointments,
  getTopDoctors,
  getMonthlyRevenue,
  getAppointmentsByStatus,
  getPaymentMethodsBreakdown,
} from "../services/dashboard.service.js";

// GET /api/reports/dashboard
export async function getDashboard(req, res, next) {
  try {
    const { period = "month" } = req.query;
    const stats = await getDashboardStats(period);
    res.json(stats);
  } catch (err) {
    next(err);
  }
}

// GET /api/reports/today
export async function getTodayStats(req, res, next) {
  try {
    const appointments = await getTodayAppointments();
    res.json({ appointments, total: appointments.length });
  } catch (err) {
    next(err);
  }
}

// GET /api/reports/top-doctors
export async function getTopDoctorsReport(req, res, next) {
  try {
    const { limit = 5 } = req.query;
    const doctors = await getTopDoctors(Number(limit));
    res.json(doctors);
  } catch (err) {
    next(err);
  }
}

// GET /api/reports/monthly-revenue
export async function getMonthlyRevenueReport(req, res, next) {
  try {
    const { year = new Date().getFullYear() } = req.query;
    const data = await getMonthlyRevenue(Number(year));
    res.json(data);
  } catch (err) {
    next(err);
  }
}

// GET /api/reports/appointments-status
export async function getAppointmentStatusReport(req, res, next) {
  try {
    const data = await getAppointmentsByStatus();
    res.json(data);
  } catch (err) {
    next(err);
  }
}

// GET /api/reports/payment-methods
export async function getPaymentMethodsReport(req, res, next) {
  try {
    const data = await getPaymentMethodsBreakdown();
    res.json(data);
  } catch (err) {
    next(err);
  }
}

// GET /api/reports/appointments
export async function getAppointmentReportData(req, res, next) {
  try {
    const { range, startDate, endDate } = req.query;
    const data = await getAppointmentReport({ range, startDate, endDate });
    res.json(data);
  } catch (err) {
    next(err);
  }
}

// GET /api/reports/revenue
export async function getRevenueReportData(req, res, next) {
  try {
    const { range, startDate, endDate, groupBy } = req.query;
    const data = await getRevenueReport({ range, startDate, endDate, groupBy });
    res.json(data);
  } catch (err) {
    next(err);
  }
}

// GET /api/reports/doctors
export async function getDoctorReportData(req, res, next) {
  try {
    const { range, startDate, endDate, doctorId } = req.query;
    const data = await getDoctorPerformanceReport({
      range,
      startDate,
      endDate,
      doctorId,
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
}

// GET /api/reports/patients
export async function getPatientReportData(req, res, next) {
  try {
    const { range, startDate, endDate } = req.query;
    const data = await getPatientReport({ range, startDate, endDate });
    res.json(data);
  } catch (err) {
    next(err);
  }
}
