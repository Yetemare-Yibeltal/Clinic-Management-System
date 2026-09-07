// doctorService.js — Doctor API calls
import api from "./api.js";
import { API } from "../constants/apiEndpoints.js";
import { buildQueryString } from "../utils/helpers.js";

export const doctorService = {
  // Get all doctors with optional filters
  async getAllDoctors(params = {}) {
    const query = buildQueryString(params);
    const response = await api.get(`${API.DOCTORS.LIST}${query}`);
    return response.data;
  },

  // Get doctor by ID
  async getDoctorById(id) {
    const response = await api.get(API.DOCTORS.DETAIL(id));
    return response.data;
  },

  // Get all specializations list
  async getSpecializations() {
    const response = await api.get(API.DOCTORS.SPECIALIZATIONS);
    return response.data;
  },

  // Update doctor profile (admin or the doctor themselves)
  async updateDoctor(id, data) {
    const response = await api.patch(API.DOCTORS.UPDATE(id), data);
    return response.data;
  },

  // Toggle doctor availability
  async toggleAvailability(id, available) {
    const response = await api.patch(API.DOCTORS.TOGGLE_AVAILABLE(id), {
      available,
    });
    return response.data;
  },

  // Upload doctor avatar
  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append("avatar", file);
    const response = await api.post(API.UPLOAD.AVATAR, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Search doctors with advanced filters
  async searchDoctors(params = {}) {
    const query = buildQueryString(params);
    const response = await api.get(`${API.SEARCH.DOCTORS}${query}`);
    return response.data;
  },
};
