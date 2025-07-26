import { PrismaClient } from "@prisma/client";
import IRequest from "../Middleware/IRequest";
import { Request, Response } from "express";
const client = new PrismaClient();

const sharePhoto = async (req: IRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { receiverEmail, photoId } = req.body;

    const receiverUser = await client.user.findUnique({
      where: { email: receiverEmail },
    });
    
    if (!receiverUser) {
      res.status(400).json({ error: "User does not exist" });
      return;
    }

    if (receiverUser.id === Number(userId)) {
      res.status(400).json({ error: "Cannot share photo with yourself" });
      return;
    }

    const photo = await client.uploadData.findUnique({
      where: { id: photoId },
      select: {
        id: true,
        userId: true,
        sharedWith: true,
      },
    });

    if (!photo || photo.userId !== Number(userId)) {
      res.status(403).json({ error: "You do not own this photo or it doesn't exist" });
      return;
    }

    if (photo.sharedWith.includes(receiverUser.id)) {
      res.status(400).json({ error: "Photo already shared with this user" });
      return;
    }

    await client.uploadData.update({
      where: { id: photoId },
      data: {
        sharedWith: {
          push: receiverUser.id,
        },
      },
    });

    res.status(200).json({ message: "Photo shared successfully" });
  } catch (e: unknown) {
    console.error("Share error:", e);
    res.status(500).json({
      message: e instanceof Error ? e.message : "An unknown error occurred",
    });
  }
};


const viewSharedPhotos = async (req: IRequest, res: Response): Promise<void> => {
  try {
    const loggedInUserId = Number(req.userId);

    const myPhotos = await client.uploadData.findMany({
      where: {
        userId: loggedInUserId,
        sharedWith: {
          isEmpty: false, // Only show photos that are shared
        },
      },
      select: {
        id: true,
        photo: true,
        description: true,
        sharedWith: true,
      },
    });

    // Get all user IDs from sharedWith arrays
    const allUserIds = [...new Set(myPhotos.flatMap(photo => photo.sharedWith))];

    const users = await client.user.findMany({
      where: {
        id: { in: allUserIds },
      },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    // Create a map with full user info
    const userMap = Object.fromEntries(
      users.map(user => [user.id, { username: user.username, email: user.email }])
    );

    const formatted = myPhotos.flatMap(photo => 
      photo.sharedWith.map(userId => ({
        uploadData: {
          id: photo.id,
          photo: photo.photo,
          description: photo.description,
        },
        user: {
          id: userId,
          username: userMap[userId]?.username || "Unknown",
          email: userMap[userId]?.email || "N/A",
        },
      }))
    );

    res.status(200).json({
      message: "Your shared photos",
      data: formatted,
    });
  } catch (e: unknown) {
    console.error("ViewSharedPhotos error:", e);
    res.status(500).json({
      message: e instanceof Error ? e.message : "An unknown error occurred",
    });
  }
};



const sharedToMe = async (req: IRequest, res: Response): Promise<void> => {
  try {
    const loggedInUserId = Number(req.userId);

    const sharedPhotos = await client.uploadData.findMany({
      where: {
        sharedWith: {
          has: loggedInUserId,
        },
      },
      select: {
        id: true,
        photo: true,
        description: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true
          },
        },
      },
    });

    res.status(200).json({
      message: "Photos shared with you",
      data: sharedPhotos,
    });
  } catch (e: unknown) {
    console.error("SharedToMe error:", e);
    res.status(500).json({
      message: e instanceof Error ? e.message : "An unknown error occurred",
    });
  }
};

 const shareController = {
    sharePhoto,
    viewSharedPhotos,
    sharedToMe
}
        
export default shareController;
