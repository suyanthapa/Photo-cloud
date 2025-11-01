import { PrismaClient } from "@prisma/client";
import IRequest from "../Middleware/IRequest";
import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import {
  NotFoundError,
  UnauthorizedError,
  ValidationError,
  ConflictError,
} from "../utils/errors";
import { sendSuccess } from "../utils/response";
import { io } from "../server";

const client = new PrismaClient();

const sharePhoto = asyncHandler(
  async (req: IRequest, res: Response): Promise<void> => {
    const userId = req.userId;
    const { receiverEmail, photoId } = req.body;

    const receiverUser = await client.user.findUnique({
      where: { email: receiverEmail },
    });

    if (!receiverUser) {
      throw new NotFoundError("User does not exist");
    }

    if (receiverUser.id === Number(userId)) {
      throw new ValidationError("Cannot share photo with yourself");
    }

    const photo = await client.uploadData.findUnique({
      where: { id: photoId },
      select: {
        id: true,
        userId: true,
      },
    });

    if (!photo || photo.userId !== Number(userId)) {
      throw new UnauthorizedError(
        "You do not own this photo or it doesn't exist"
      );
    }

    const alreadyShared = await client.photoShare.findFirst({
      where: {
        photoId,
        sharedWith: receiverEmail,
      },
    });

    if (alreadyShared) {
      throw new ConflictError("Photo already shared with this email");
    }

    // Save share record
    await client.photoShare.create({
      data: {
        photoId,
        sharedById: Number(userId),
        sharedWith: receiverEmail,
      },
    });

    // Get sharer's info for notification
    const sharer = await client.user.findUnique({
      where: { id: Number(userId) },
      select: { username: true },
    });

    // Create notification for receiver
    const notification = await client.notification.create({
      data: {
        userId: receiverUser.id,
        actorId: Number(userId),
        type: "photo_shared",
        title: "Photo Shared",
        body: `${sharer?.username || "Someone"} shared a photo with you`,
        data: JSON.stringify({
          photoId: photoId,
          sharedBy: sharer?.username || "Unknown",
          sharedAt: new Date().toISOString(),
        }),
        isRead: false,
      },
      include: {
        actor: {
          select: { id: true, username: true, email: true },
        },
      },
    });

    // Send real-time notification via Socket.IO
    io.to(receiverUser.id.toString()).emit("notification", {
      type: "new_notification",
      notification: notification,
    });

    sendSuccess(res, null, "Photo shared successfully");
  }
);

const viewSharedPhotos = asyncHandler(
  async (req: IRequest, res: Response): Promise<void> => {
    const loggedInUserId = Number(req.userId);

    //Find all PhotoShare records where the current user shared the photo
    const shares = await client.photoShare.findMany({
      where: {
        sharedById: loggedInUserId,
      },
      include: {
        //Include related photo data for each shared entry
        photo: {
          select: {
            id: true,
            photo: true,
            description: true,
          },
        },
      },
    });

    //format the result for frontend display
    const formatted = shares.map((share) => ({
      sharedAt: share.sharedAt,
      sharedWith: share.sharedWith,
      photo: {
        id: share.photo.id,
        photo: share.photo.photo,
        discription: share.photo.description,
      },
    }));

    sendSuccess(res, formatted, "Your shared photos");
  }
);

const sharedToMe = asyncHandler(
  async (req: IRequest, res: Response): Promise<void> => {
    const loggedInUserId = Number(req.userId);

    // First get current user's email in a single optimized query
    const currentUser = await client.user.findUnique({
      where: { id: loggedInUserId },
      select: { email: true },
    });

    if (!currentUser) {
      throw new NotFoundError("User not found");
    }

    // Optimized: Single query with all required includes to avoid N+1
    const sharedPhotos = await client.photoShare.findMany({
      where: {
        sharedWith: currentUser.email,
      },
      include: {
        photo: {
          select: {
            id: true,
            description: true,
            photo: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
          },
        },
        sharedBy: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    const formatted = sharedPhotos.map((entry) => ({
      sharedAt: entry.sharedAt,
      sharedBy: entry.photo.user,
      photo: {
        id: entry.photo.id,
        photo: entry.photo.photo,
        description: entry.photo.description,
        createdAt: entry.photo.createdAt,
      },
    }));

    sendSuccess(res, formatted, "Photos shared with you");
  }
);

const shareController = {
  sharePhoto,
  viewSharedPhotos,
  sharedToMe,
};

export default shareController;
