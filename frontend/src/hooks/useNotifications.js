// useNotifications.js — Notification management hook
import { useEffect, useCallback } from "react";
import useNotificationStore from "../store/notificationStore.js";
import useAuthStore from "../store/authStore.js";

export function useNotifications() {
  const { isLoggedIn } = useAuthStore();
  const {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    addNotification,
    reset,
  } = useNotificationStore();

  // Poll for unread count every 30 seconds
  useEffect(() => {
    if (!isLoggedIn) return;

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [isLoggedIn]);

  const loadNotifications = useCallback(
    (params = {}) => fetchNotifications(params),
    [],
  );

  return {
    notifications,
    unreadCount,
    isLoading,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    addNotification,
    reset,
  };
}
