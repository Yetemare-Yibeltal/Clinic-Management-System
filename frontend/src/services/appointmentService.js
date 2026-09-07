// appointmentService.js — Appointment API calls
import api from "./api.js";
import { API } from "../constants/apiEndpoints.js";
import { buildQueryString } from "../utils/helpers.js";

export const appointmentService = {
  // Book a new appointment
  async createAppointment(data) {
    const response = await api.post(API.APPOINTMENTS.CREATE, data);
    return response.data;
  },

  // Get appointments (role-scoped)
  async getAppointments(params = {}) {
    const query = buildQueryString(params);
    const response = await api.get(`${API.APPOINTMENTS.LIST}${query}`);
    return response.data;
  },

  // Get single appointment by ID
  async getAppointmentById(id) {
    const response = await api.get(API.APPOINTMENTS.DETAIL(id));
    return response.data;
  },

  // Update appointment status
  async updateStatus(id, data) {
    const response = await api.patch(API.APPOINTMENTS.UPDATE_STATUS(id), data);
    return response.data;
  },

  // Bulk update appointment statuses (admin)
  async bulkUpdateStatus(ids, status) {
    const response = await api.patch(API.APPOINTMENTS.BULK_STATUS, {
      ids,
      status,
    });
    return response.data;
  },

  // Reschedule an appointment
  async rescheduleAppointment(id, newDate, newTime) {
    const response = await api.patch(API.APPOINTMENTS.RESCHEDULE(id), {
      newDate,
      newTime,
    });
    return response.data;
  },

  // Doctor adds diagnosis and prescription
  async addDiagnosis(id, data) {
    const response = await api.patch(API.APPOINTMENTS.DIAGNOSIS(id), data);
    return response.data;
  },

  // Cancel an appointment
  async cancelAppointment(id, cancellationNote = "") {
    const response = await api.patch(API.APPOINTMENTS.UPDATE_STATUS(id), {
      status: "cancelled",
      cancellationNote,
    });
    return response.data;
  },

  // Confirm an appointment (admin/doctor)
  async confirmAppointment(id) {
    const response = await api.patch(API.APPOINTMENTS.UPDATE_STATUS(id), {
      status: "confirmed",
    });
    return response.data;
  },

  // Complete an appointment (doctor)
  async completeAppointment(id, notes = "") {
    const response = await api.patch(API.APPOINTMENTS.UPDATE_STATUS(id), {
      status: "completed",
      notes,
    });
    return response.data;
  },
};
