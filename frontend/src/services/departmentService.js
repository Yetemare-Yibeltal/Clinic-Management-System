// departmentService.js — Department API calls
import api from "./api.js";
import { API } from "../constants/apiEndpoints.js";
import { buildQueryString } from "../utils/helpers.js";

export const departmentService = {
  // Get all departments
  async getDepartments(params = {}) {
    const query = buildQueryString(params);
    const response = await api.get(`${API.DEPARTMENTS.LIST}${query}`);
    return response.data;
  },

  // Get department by ID with its doctors
  async getDepartmentById(id) {
    const response = await api.get(API.DEPARTMENTS.DETAIL(id));
    return response.data;
  },

  // Create department (admin)
  async createDepartment(data) {
    const response = await api.post(API.DEPARTMENTS.CREATE, data);
    return response.data;
  },

  // Update department (admin)
  async updateDepartment(id, data) {
    const response = await api.patch(API.DEPARTMENTS.UPDATE(id), data);
    return response.data;
  },

  // Delete department (admin)
  async deleteDepartment(id) {
    const response = await api.delete(API.DEPARTMENTS.DELETE(id));
    return response.data;
  },

  // Assign doctor to department (admin)
  async assignDoctor(departmentId, doctorId) {
    const response = await api.patch(
      API.DEPARTMENTS.ASSIGN_DOCTOR(departmentId),
      { doctorId },
    );
    return response.data;
  },
};
