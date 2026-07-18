// notification.controller.js — Notification management for all users
import Notification from "../models/Notification.model.js";
import {
  markAsRead,
  markAllAsRead,
  getUnreadCount,
} from "../services/notification.service.js";

// GET /api/notifications
// Returns all notifications for the logged-in user
export async function getNotifications(req, res, next) {
  try {
    const { page = 1, limit = 20, unreadOnly } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter = { recipient: req.user._id };
    if (unreadOnly === "true") filter.isRead = false;

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate("appointment", "date time status")
        .populate("payment", "amount status method"),
      Notification.countDocuments(filter),
      getUnreadCount(req.user._id),
    ]);

    res.json({
      notifications,
      unreadCount,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/notifications/:id/read
// Mark a single notification as read
export async function markNotificationRead(req, res, next) {
  try {
    const notification = await markAsRead(req.params.id, req.user._id);

    if (!notification) {
      return res.status(404).json({ error: "Notification not found." });
    }

    res.json({ message: "Notification marked as read.", notification });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/notifications/read-all
// Mark all notifications as read for the logged-in user
export async function markAllNotificationsRead(req, res, next) {
  try {
    await markAllAsRead(req.user._id);
    res.json({ message: "All notifications marked as read." });
  } catch (err) {
    next(err);
  }
}

// GET /api/notifications/unread-count
// Returns just the unread notification count for the bell icon
export async function getUnreadNotificationCount(req, res, next) {
  try {
    const count = await getUnreadCount(req.user._id);
    res.json({ unreadCount: count });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/notifications/:id
// Delete a single notification
export async function deleteNotification(req, res, next) {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({ error: "Notification not found." });
    }

    res.json({ message: "Notification deleted." });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/notifications
// Delete all notifications for the logged-in user
export async function deleteAllNotifications(req, res, next) {
  try {
    await Notification.deleteMany({ recipient: req.user._id });
    res.json({ message: "All notifications deleted." });
  } catch (err) {
    next(err);
  }
}
