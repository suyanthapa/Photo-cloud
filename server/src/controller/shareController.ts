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
        userId: true
       
      },
    });

    if (!photo || photo.userId !== Number(userId)) {
      res.status(403).json({ error: "You do not own this photo or it doesn't exist" });
      return;
    }

    const alreadyShared = await client.photoShare.findFirst({
      where: 
        {  
          photoId,
          sharedWith: receiverEmail,

         },
    });

    if(alreadyShared){
        res.status(400).json({ error: "Photo already shared with this email" });
      return;
    }

    
       // Save share record
    await client.photoShare.create({
      data: {
        photoId,
        sharedById: Number(userId),
        sharedWith: receiverEmail,
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

    //Find all PhotoShare records where the current user shared the photo
    const shares = await client.photoShare.findMany({
      where: {
        sharedById: loggedInUserId,
      },
      include :{ //Include related photo data for each shared entry
        photo: {
          select :{
            id: true,
            photo: true,
            description : true
          },
        },
      },
    });

    //format the result for frontend display
    const formatted = shares.map(share => ({

      sharedAt: share.sharedAt,
      sharedWith: share.sharedWith,
      photo: {
        id: share.photo.id,
        photo: share.photo.photo,
        discription: share.photo.description
      }
    }))
   


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

     // Step 1: Get current user's email
    const currentUser = await client.user.findUnique({
      where: { id: loggedInUserId },
    });

    if (!currentUser) {
      res.status(400).json({ error: "User not found" });
      return;
    }

    const sharedPhotos = await client.photoShare.findMany({
      where : 
      {
        sharedWith : currentUser.email
      },
      include: {
        photo : {
          select : {
            id : true,
            description: true,
            photo: true,
            createdAt: true,
            user : {
              select : {
                 id: true,
                  username: true,
                  email : true
              },
            },
          },
        },
      },
    })


    const formatted = sharedPhotos.map((entry) => ({
      sharedAt : entry.sharedAt,
      sharedBy: entry.photo.user,
      photo: {
        id: entry.photo.id,
         photo: entry.photo.photo,
        description: entry.photo.description,
        createdAt: entry.photo.createdAt,
      }
    
    }))
    res.status(200).json({
      message: "Photos shared with you",
      data: formatted,
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
