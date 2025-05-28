import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import upload from "../Middleware/multerConfig";
import IRequest from '../Middleware/IRequest';

const client = new PrismaClient()

const uploadData = async(req: IRequest, res: Response):Promise <void> => {
 try{
    const userId = req.userId; 
     // Access the file from req.files, not req.body
    const photo = (req.files as { photo?: Express.Multer.File[] })?.photo?.[0];


    const { description } = req.body;
    console.log("body is", req.body)
    console.log("The file is", photo)
    console.log("The description is ", description);
    console.log("The USERiD is", userId)


  
    if (!photo) {
      res.status(400).json({ message: "No file uploaded." });
      return;
    }

     if (!description || !userId) {
      res.status(400).json({ message: "Missing description or userId." });
      return;
    }

    const upload = await client.uploadData.create({
        data: {
            photo: photo.filename,
            description,
            userId : parseInt(userId, 10)
        }
    });

    res.status(201).json({
        message: "Uploaded Sucessfully", 
        data: upload
    })

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

const viewUploadedData = async (req: Request, res: Response):Promise <void> => {

    try{

      
    return
    }
      catch (e:unknown){
        console.error("View Uploaded Data Error:",e);

        if(e instanceof Error){
          res.status(500).json({ message: e.message});
        }
        else{
          res.status(500).json({message: "An unknown erro occured"})
        }
      }
    }

const uploadController = {
    uploadData,
    viewUploadedData
}

export default uploadController;