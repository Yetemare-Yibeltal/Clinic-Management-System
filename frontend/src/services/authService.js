// authService.js — Authentication API calls
import api from "./api.js";
import { API } from "../constants/apiEndpoints.js";

export const authService = {
  // Register new user
  async register(data) {
    const response = await api.post(API.AUTH.REGISTER, data);
    return response.data;
  },

  // Login
  async login(data) {
    const response = await api.post(API.AUTH.LOGIN, data);
    return response.data;
  },

  // Get current logged-in user
  async getMe() {
    const response = await api.get(API.AUTH.ME);
    return response.data;
  },

  // Forgot password — sends reset email
  async forgotPassword(email) {
    const response = await api.post(API.AUTH.FORGOT_PASSWORD, { email });
    return response.data;
  },

  // Reset password with token
  async resetPassword(token, newPassword) {
    const response = await api.patch(API.AUTH.RESET_PASSWORD, {
      token,
      newPassword,
    });
    return response.data;
  },

  // Change password (logged in user)
  async changePassword(currentPassword, newPassword) {
    const response = await api.patch(API.AUTH.CHANGE_PASSWORD, {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  // Logout
  async logout() {
    try {
      await api.post(API.AUTH.LOGOUT);
    } catch {
      // Ignore errors — always clear local storage
    } finally {
      localStorage.removeItem("ky_token");
      localStorage.removeItem("ky_user");
    }
  },

  // Save auth data to localStorage after login
  saveAuth(token, user) {
    localStorage.setItem("ky_token", token);
    localStorage.setItem("ky_user", JSON.stringify(user));
  },

  // Get saved token
  getToken() {
    return localStorage.getItem("ky_token");
  },

  // Get saved user
  getSavedUser() {
    try {
      const user = localStorage.getItem("ky_user");
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  // Check if user is logged in
  isLoggedIn() {
    return !!localStorage.getItem("ky_token");
  },
};
