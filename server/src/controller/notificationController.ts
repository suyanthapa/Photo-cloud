import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/response";
import { NotFoundError, UnauthorizedError } from "../utils/errors";

interface IRequest extends Request {
  userId?: number;
}

const client = new PrismaClient();

// Get all notifications for a user
const getNotifications = asyncHandler(
  async (req: IRequest, res: Response): Promise<void> => {
    const userId = Number(req.userId);

    if (!userId) {
      throw new UnauthorizedError("User ID missing");
    }

    const notifications = await client.notification.findMany({
      where: { userId: userId },
      include: {
        actor: {
          select: { id: true, username: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    sendSuccess(res, notifications, "Notifications fetched successfully");
  }
);

// Mark notification as read
const markAsRead = asyncHandler(
  async (req: IRequest, res: Response): Promise<void> => {
    const { notificationId } = req.params;
    const userId = Number(req.userId);

    if (!userId) {
      throw new UnauthorizedError("User ID missing");
    }

    const notification = await client.notification.findFirst({
      where: {
        id: Number(notificationId),
        userId: userId,
      },
    });

    if (!notification) {
      throw new NotFoundError("Notification");
    }

    await client.notification.update({
      where: { id: Number(notificationId) },
      data: {
        isRead: true,
      },
    });

    sendSuccess(res, null, "Notification marked as read");
  }
);

// Mark all notifications as read
const markAllAsRead = asyncHandler(
  async (req: IRequest, res: Response): Promise<void> => {
    const userId = Number(req.userId);

    if (!userId) {
      throw new UnauthorizedError("User ID missing");
    }

    await client.notification.updateMany({
      where: {
        userId: userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    sendSuccess(res, null, "All notifications marked as read");
  }
);

// Get unread notification count
const getUnreadCount = asyncHandler(
  async (req: IRequest, res: Response): Promise<void> => {
    const userId = Number(req.userId);

    if (!userId) {
      throw new UnauthorizedError("User ID missing");
    }

    const count = await client.notification.count({
      where: {
        userId: userId,
        isRead: false,
      },
    });

    sendSuccess(res, { count }, "Unread count fetched successfully");
  }
);

// Delete notification
const deleteNotification = asyncHandler(
  async (req: IRequest, res: Response): Promise<void> => {
    const { notificationId } = req.params;
    const userId = Number(req.userId);

    if (!userId) {
      throw new UnauthorizedError("User ID missing");
    }

    const notification = await client.notification.findFirst({
      where: {
        id: Number(notificationId),
        userId: userId,
      },
    });

    if (!notification) {
      throw new NotFoundError("Notification");
    }

    await client.notification.delete({
      where: { id: Number(notificationId) },
    });

    sendSuccess(res, null, "Notification deleted successfully");
  }
);

const notificationController = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  deleteNotification,
};

export default notificationController;
