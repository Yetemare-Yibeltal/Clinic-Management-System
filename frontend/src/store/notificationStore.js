// notificationStore.js — Global notification state using Zustand
import { create } from "zustand";
import { notificationService } from "../services/notificationService.js";

const useNotificationStore = create((set, get) => ({
  // ── State ──────────────────────────────────────────
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  hasMore: true,
  page: 1,

  // ── Fetch notifications ────────────────────────────
  fetchNotifications: async (params = {}) => {
    set({ isLoading: true });
    try {
      const data = await notificationService.getNotifications({
        page: 1,
        limit: 20,
        ...params,
      });
      set({
        notifications: data.notifications,
        unreadCount: data.unreadCount,
        hasMore: data.pagination.page < data.pagination.totalPages,
        page: 1,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  // ── Fetch unread count only (for bell icon polling) ─
  fetchUnreadCount: async () => {
    try {
      const data = await notificationService.getUnreadCount();
      set({ unreadCount: data.unreadCount });
    } catch {
      // Silently fail — don't break UI for notification count
    }
  },

  // ── Mark single notification as read ──────────────
  markAsRead: async (id) => {
    try {
      await notificationService.markAsRead(id);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n._id === id ? { ...n, isRead: true } : n,
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch {
      // Silently fail
    }
  },

  // ── Mark all as read ───────────────────────────────
  markAllAsRead: async () => {
    try {
      await notificationService.markAllAsRead();
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        unreadCount: 0,
      }));
    } catch {
      // Silently fail
    }
  },

  // ── Delete notification ────────────────────────────
  deleteNotification: async (id) => {
    try {
      await notificationService.deleteNotification(id);
      set((state) => ({
        notifications: state.notifications.filter((n) => n._id !== id),
      }));
    } catch {
      // Silently fail
    }
  },

  // ── Delete all ─────────────────────────────────────
  deleteAllNotifications: async () => {
    try {
      await notificationService.deleteAllNotifications();
      set({ notifications: [], unreadCount: 0 });
    } catch {
      // Silently fail
    }
  },

  // ── Add a new notification (from real-time event) ──
  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  // ── Reset store ────────────────────────────────────
  reset: () => {
    set({ notifications: [], unreadCount: 0, isLoading: false, page: 1 });
  },
}));

export default useNotificationStore;
