import express from "express";
import notificationController from "../controller/notificationController";
import getUserfromAuthToken from "../Middleware/jwtfromUser";

const router = express.Router();

// All notification routes require authentication
router.use(getUserfromAuthToken);

// GET /api/notifications - Get all notifications for authenticated user
router.get("/", notificationController.getNotifications);

// GET /api/notifications/unread-count - Get unread notification count
router.get("/unread-count", notificationController.getUnreadCount);

// PATCH /api/notifications/:notificationId/read - Mark specific notification as read
router.patch("/:notificationId/read", notificationController.markAsRead);

// PATCH /api/notifications/mark-all-read - Mark all notifications as read
router.patch("/mark-all-read", notificationController.markAllAsRead);

// DELETE /api/notifications/:notificationId - Delete specific notification
router.delete("/:notificationId", notificationController.deleteNotification);

export default router;
