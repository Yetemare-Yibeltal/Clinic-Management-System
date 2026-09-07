// adminService.js — Admin API calls
import api from "./api.js";
import { API } from "../constants/apiEndpoints.js";
import { buildQueryString } from "../utils/helpers.js";

export const adminService = {
  // Get all users with filters
  async getAllUsers(params = {}) {
    const query = buildQueryString(params);
    const response = await api.get(`${API.ADMIN.USERS}${query}`);
    return response.data;
  },

  // Get user by ID
  async getUserById(id) {
    const response = await api.get(API.ADMIN.USER_DETAIL(id));
    return response.data;
  },

  // Update user active status
  async updateUserStatus(id, isActive) {
    const response = await api.patch(API.ADMIN.USER_STATUS(id), { isActive });
    return response.data;
  },

  // Change user role
  async changeUserRole(id, role) {
    const response = await api.patch(API.ADMIN.USER_ROLE(id), { role });
    return response.data;
  },

  // Reset user password
  async resetUserPassword(id) {
    const response = await api.patch(API.ADMIN.RESET_PASSWORD(id));
    return response.data;
  },

  // Delete user
  async deleteUser(id) {
    const response = await api.delete(API.ADMIN.DELETE_USER(id));
    return response.data;
  },

  // Get audit logs
  async getAuditLogs(params = {}) {
    const query = buildQueryString(params);
    const response = await api.get(`${API.ADMIN.AUDIT_LOGS}${query}`);
    return response.data;
  },

  // Get system stats
  async getSystemStats() {
    const response = await api.get(API.ADMIN.SYSTEM_STATS);
    return response.data;
  },
};
