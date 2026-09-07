// notificationService.js — Notification API calls
import api from "./api.js";
import { API } from "../constants/apiEndpoints.js";
import { buildQueryString } from "../utils/helpers.js";

export const notificationService = {
  // Get all notifications for logged-in user
  async getNotifications(params = {}) {
    const query = buildQueryString(params);
    const response = await api.get(`${API.NOTIFICATIONS.LIST}${query}`);
    return response.data;
  },

  // Get unread count for bell icon
  async getUnreadCount() {
    const response = await api.get(API.NOTIFICATIONS.UNREAD_COUNT);
    return response.data;
  },

  // Mark single notification as read
  async markAsRead(id) {
    const response = await api.patch(API.NOTIFICATIONS.READ(id));
    return response.data;
  },

  // Mark all notifications as read
  async markAllAsRead() {
    const response = await api.patch(API.NOTIFICATIONS.READ_ALL);
    return response.data;
  },

  // Delete a single notification
  async deleteNotification(id) {
    const response = await api.delete(API.NOTIFICATIONS.DELETE(id));
    return response.data;
  },

  // Delete all notifications
  async deleteAllNotifications() {
    const response = await api.delete(API.NOTIFICATIONS.DELETE_ALL);
    return response.data;
  },
};
