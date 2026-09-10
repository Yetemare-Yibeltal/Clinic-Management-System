// patientService.js — Patient profile API calls
import api from "./api.js";
import { API } from "../constants/apiEndpoints.js";

export const patientService = {
  async getMyProfile() {
    const response = await api.get(API.PATIENTS.MY_PROFILE);
    return response.data;
  },

  async updateMyProfile(data) {
    const response = await api.patch(API.PATIENTS.UPDATE_PROFILE, data);
    return response.data;
  },

  async getPatientById(id) {
    const response = await api.get(API.PATIENTS.DETAIL(id));
    return response.data;
  },

  async getAllPatients(params = {}) {
    const query = Object.keys(params).length
      ? "?" + new URLSearchParams(params).toString()
      : "";
    const response = await api.get(`${API.PATIENTS.LIST}${query}`);
    return response.data;
  },

  async changePassword(currentPassword, newPassword) {
    const response = await api.patch(API.PATIENTS.CHANGE_PASSWORD, {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
};
