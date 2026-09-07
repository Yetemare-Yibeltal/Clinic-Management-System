// reportService.js — Report and analytics API calls
import api from "./api.js";
import { API } from "../constants/apiEndpoints.js";
import { buildQueryString } from "../utils/helpers.js";

export const reportService = {
  // Main dashboard stats
  async getDashboard(period = "month") {
    const response = await api.get(`${API.REPORTS.DASHBOARD}?period=${period}`);
    return response.data;
  },

  // Today's appointments
  async getTodayStats() {
    const response = await api.get(API.REPORTS.TODAY);
    return response.data;
  },

  // Top performing doctors
  async getTopDoctors(limit = 5) {
    const response = await api.get(`${API.REPORTS.TOP_DOCTORS}?limit=${limit}`);
    return response.data;
  },

  // Monthly revenue chart data
  async getMonthlyRevenue(year = new Date().getFullYear()) {
    const response = await api.get(
      `${API.REPORTS.MONTHLY_REVENUE}?year=${year}`,
    );
    return response.data;
  },

  // Appointments by status for pie chart
  async getAppointmentsByStatus() {
    const response = await api.get(API.REPORTS.APPOINTMENTS_STATUS);
    return response.data;
  },

  // Payment methods breakdown
  async getPaymentMethods() {
    const response = await api.get(API.REPORTS.PAYMENT_METHODS);
    return response.data;
  },

  // Detailed appointment report
  async getAppointmentReport(params = {}) {
    const query = buildQueryString(params);
    const response = await api.get(`${API.REPORTS.APPOINTMENTS}${query}`);
    return response.data;
  },

  // Revenue report
  async getRevenueReport(params = {}) {
    const query = buildQueryString(params);
    const response = await api.get(`${API.REPORTS.REVENUE}${query}`);
    return response.data;
  },

  // Doctor performance report
  async getDoctorReport(params = {}) {
    const query = buildQueryString(params);
    const response = await api.get(`${API.REPORTS.DOCTORS}${query}`);
    return response.data;
  },

  // Patient statistics report
  async getPatientReport(params = {}) {
    const query = buildQueryString(params);
    const response = await api.get(`${API.REPORTS.PATIENTS}${query}`);
    return response.data;
  },
};
