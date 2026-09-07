// scheduleService.js — Schedule API calls
import api from "./api.js";
import { API } from "../constants/apiEndpoints.js";
import { buildQueryString } from "../utils/helpers.js";

export const scheduleService = {
  // Get doctor's full weekly schedule
  async getSchedule(doctorId) {
    const response = await api.get(API.SCHEDULES.GET(doctorId));
    return response.data;
  },

  // Get available time slots for a doctor on a specific date
  async getAvailableSlots(doctorId, date) {
    const query = buildQueryString({ date });
    const response = await api.get(
      `${API.SCHEDULES.AVAILABLE(doctorId)}${query}`,
    );
    return response.data;
  },

  // Save full weekly schedule (replaces entire grid)
  async saveSchedule(doctorId, weeklyGrid) {
    const response = await api.put(API.SCHEDULES.SAVE(doctorId), {
      weeklyGrid,
    });
    return response.data;
  },

  // Toggle a single slot
  async updateSlot(doctorId, day, slot, type) {
    const response = await api.patch(API.SCHEDULES.UPDATE_SLOT(doctorId), {
      day,
      slot,
      type,
    });
    return response.data;
  },
};
