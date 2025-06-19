import { PrismaClient } from "@prisma/client";
import IRequest from "../Middleware/IRequest";
import { Request, Response } from "express";
const client = new PrismaClient();

const sharePhoto = async (req: IRequest, res: Response): Promise <void> => {

    try{
          const userId = req.userId;
    const { receiverId, photoId} = req.body;

    const existingUser = await client.user.findUnique({
       where: {
          id: Number(receiverId)
         },
      }); 
      //CHECK USER EXISTS OR NOT
      if(!existingUser){
         res.status(400).json({ error: "User doesnot exist" });
        return;
      }
      console.log("Receiver id is", receiverId);
        console.log("Mine id is", userId);

          //check photo exists or not
      const photo = await client.uploadData.findFirst({
       where:
       { id: photoId }
      })

      
      if(photo?.userId !== userId){
        res.status(400).json({
            error: "Respective Photo doesnot exist"
        })
      }

        if(receiverId===userId){
        res.status(400).json({
            error: "Photos can't be shared to yourself.. "
        })
      }
      //check if already shared or not
      const alreadyShared = await client.userSharedPhotos.findUnique({
        where: {
            userId_uploadDataId: {
                userId: receiverId,
                uploadDataId: photoId
            }
        }
      })

      if(alreadyShared){
        res.status(400).json({
            error: "Photo already shared "
        })
      }

        //share photo to other
     const sharePhoto = await client.userSharedPhotos.create({
        data: {
            userId: receiverId,
            uploadDataId: photoId
        }
      })
       if(!sharePhoto){
        res.status(400).json(
            {
                error: " Sharing photos failed"
            }
        )
      }

      res.status(200).json({message: "Photos shared successfully"})
      return
    }   

    catch (e: unknown) {
    console.error("Upload error:", e);
    if (e instanceof Error) {
       res.status(500).json({ message: e.message });
       
    } else {
       res.status(500).json({ message: "An unknown error occurred" });
    }
  }    
     
}

const viewSharedPhotos = async (req: IRequest, res: Response): Promise <void> =>{

    try{
            const loggedInUser = Number(req.userId);
   

    const existingUser = await client.user.findUnique({
       where: {
          id: Number(loggedInUser)
         },
      }); 
      //CHECK USER EXISTS OR NOT
      if(!existingUser){
         res.status(400).json({ error: "User doesnot exist" });
        return;
      }

      const viewSharedPhotos = await client.userSharedPhotos.findMany({
      where: {
        uploadData: {
            userId: loggedInUser
        }
      },

      select: {
        user: {
            select: {
                id: true,
                username : true
            }
        },

        uploadData: {
            select:{
                id: true,
                photo: true,
                description: true
            }
        }
      }


           
       
        
      })

      res.status(200).json({
        message: "Views ",
        data: viewSharedPhotos
    }
    )
      return
    }
    catch (e: unknown) {
    console.error("Upload error:", e);
    if (e instanceof Error) {
       res.status(500).json({ message: e.message });
       
    } else {
       res.status(500).json({ message: "An unknown error occurred" });
    }
  }
  
}
 const shareController = {
    sharePhoto,
    viewSharedPhotos
}
        
export default shareController;
