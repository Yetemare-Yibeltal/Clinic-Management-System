// notification.routes.js — Maps /api/notifications/* URLs to controller
import { Router } from "express";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  getUnreadNotificationCount,
  deleteNotification,
  deleteAllNotifications,
} from "../controllers/notification.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", protect, getNotifications);
router.get("/unread-count", protect, getUnreadNotificationCount);
router.patch("/read-all", protect, markAllNotificationsRead);
router.patch("/:id/read", protect, markNotificationRead);
router.delete("/", protect, deleteAllNotifications);
router.delete("/:id", protect, deleteNotification);

export default router;
