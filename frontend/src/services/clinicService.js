// clinicService.js — Clinic settings API calls
import api from "./api.js";
import { API } from "../constants/apiEndpoints.js";

export const clinicService = {
  // Get clinic settings (public info for all, full for admin)
  async getSettings() {
    const response = await api.get(API.CLINIC.SETTINGS);
    return response.data;
  },

  // Update clinic settings (admin only)
  async updateSettings(data) {
    const response = await api.patch(API.CLINIC.SETTINGS, data);
    return response.data;
  },

  // Get payment account numbers (admin only)
  async getPaymentAccounts() {
    const response = await api.get(API.CLINIC.PAYMENT_ACCOUNTS);
    return response.data;
  },

  // Update payment account numbers (admin only)
  async updatePaymentAccounts(data) {
    const response = await api.patch(API.CLINIC.PAYMENT_ACCOUNTS, data);
    return response.data;
  },
};
