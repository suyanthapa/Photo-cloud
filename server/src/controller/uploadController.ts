import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import upload from "../Middleware/multerConfig";
import IRequest from '../Middleware/IRequest';
import { promises } from "dns";

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
            userId : Number(userId)
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

const viewUploadedData = async (req: IRequest, res: Response):Promise <void> => {

    try{
      const userId = req.userId; 

      const existingUser = await client.user.findUnique({
        where: {
          id: Number(userId)
         },
      }); 

      if(!existingUser){
         res.status(400).json({ error: "User doesnot exist" });
        return;
      }

      const data = await client.uploadData.findMany({
        where: {
          userId : Number(userId)
        }
      })

      console.log("The uploaded data is:", data);

      res.status(201).json({
        data
      })
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

const viewSingleData = async (req: IRequest, res: Response):Promise <void> => {

    try{
      const userId = req.userId; 
      const { id } = req.params; //  Get data ID from URL

      const existingUser = await client.user.findUnique({
        where: {
          id: Number(userId)
         },
      }); 

      if(!existingUser){
         res.status(400).json({ error: "User doesnot exist" });
        return;
      }

      const data = await client.uploadData.findFirst({
        where: {
          id : Number(id)
        }
      })

      if(data?.id !== Number(id)){
        res.status(400).json({
          error: "Not found any data"
        })
      }

      console.log("The uploaded data is:", data);

      res.status(201).json({
        data
      })
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

    const editData = async (req: IRequest, res:Response):Promise <void> =>{

      try{

        const userId = req.userId; //logged in user
        const {uploadedId, description} = req.body;

          const existingUser = await client.user.findUnique({
        where: {
          id: Number(userId)
         },
      }); 
      //CHECK USER EXISTS OR NOT
      if(!existingUser){
         res.status(400).json({ error: "User doesnot exist" });
        return;
      }
      
      //CHECK WHETHERE THE UPLOADED USER IS SAME OR NOT
      const verifyUser = await client.uploadData.findFirst({
        where: {
          userId : Number(userId),
          id : uploadedId
        }
      })

      if (!verifyUser) {
      
       res.status(404).json({ error: "not found any data with this document id" });
       return;
    }
   

      //update data
      const updatedData = await client.uploadData.update({
        where: {
          id : uploadedId
        },
        data:{
          description: description
        }
      })

      console.log("The updated data is", updatedData);

      res.status(200).json({
        message: "Updated Successfully",
        data: updatedData,

      })

      return;
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

//DELETE DATA
    const deleteData = async (req: IRequest, res: Response) :Promise <void> =>{

      try{
        console.log("suyan")
        const userId = req.userId;

        const {uploadedId} = req.body;
      // const uploadedId = Number(req.body.uploadedId);
       console.log("Received uploadedId:", uploadedId);

         //CHECK WHETHERE THE UPLOADED USER IS SAME OR NOT
      const verifyUser = await client.uploadData.findFirst({
        where: {
          userId : Number(userId),
          id : uploadedId
        }
      })

      if (!verifyUser) {
       res.status(404).json({ error: "not found any data with this document id" });
       return;
    }

    const deleteData = await client.uploadData.delete({
      where: {
        id: uploadedId
      }
    })

     if (!deleteData) {
       res.status(404).json({ error: " Error while deleting the data " });
       return;
    }

      res.status(200).json({
        message: "Deleted Successfully",
        DocumentId : uploadedId

      })

      return

      }
      catch (e:unknown){
      console.error(" Deleted Data Error:",e);

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
    viewUploadedData,
    viewSingleData,
    editData,
    deleteData
}

export default uploadController;