// paymentService.js — Payment API calls
import api from "./api.js";
import { API } from "../constants/apiEndpoints.js";
import { buildQueryString } from "../utils/helpers.js";

export const paymentService = {
  // Initialize Chapa online payment
  async initializeChapaPayment(appointmentId) {
    const response = await api.post(API.PAYMENTS.INITIALIZE, { appointmentId });
    return response.data;
  },

  // Verify Chapa payment after redirect
  async verifyChapaPayment(txRef) {
    const response = await api.post(API.PAYMENTS.VERIFY, { txRef });
    return response.data;
  },

  // Submit manual payment proof
  async submitManualPayment(data, receiptFile = null) {
    const formData = new FormData();
    formData.append("appointmentId", data.appointmentId);
    formData.append("method", data.method);
    if (data.manualTransactionId) {
      formData.append("manualTransactionId", data.manualTransactionId);
    }
    if (data.manualNote) {
      formData.append("manualNote", data.manualNote);
    }
    if (receiptFile) {
      formData.append("receipt", receiptFile);
    }

    const response = await api.post(API.PAYMENTS.MANUAL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Get payment instructions for a method
  async getInstructions(method, amount) {
    const query = buildQueryString({ amount });
    const response = await api.get(
      `${API.PAYMENTS.INSTRUCTIONS(method)}${query}`,
    );
    return response.data;
  },

  // Get all payments (role-scoped)
  async getPayments(params = {}) {
    const query = buildQueryString(params);
    const response = await api.get(`${API.PAYMENTS.LIST}${query}`);
    return response.data;
  },

  // Get payment by ID
  async getPaymentById(id) {
    const response = await api.get(API.PAYMENTS.DETAIL(id));
    return response.data;
  },

  // Get payment for a specific appointment
  async getPaymentByAppointment(appointmentId) {
    const response = await api.get(API.PAYMENTS.BY_APPOINTMENT(appointmentId));
    return response.data;
  },

  // Admin confirms manual payment
  async confirmPayment(id) {
    const response = await api.patch(API.PAYMENTS.CONFIRM(id));
    return response.data;
  },

  // Admin rejects manual payment
  async rejectPayment(id, rejectionReason) {
    const response = await api.patch(API.PAYMENTS.REJECT(id), {
      rejectionReason,
    });
    return response.data;
  },

  // Get payment receipt
  async getReceipt(id) {
    const response = await api.get(API.PAYMENTS.RECEIPT(id));
    return response.data;
  },
};
