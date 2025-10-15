import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import upload from "../config/multerConfig";
import IRequest from "../Middleware/IRequest";
import { promises } from "dns";
import { cloudinary } from "../utils/cloudinary";
import { extractPublicIdFromUrl } from "../utils/cloudinaryHelper";
import { asyncHandler } from "../utils/asyncHandler";
import {
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "../utils/errors";
import { sendSuccess } from "../utils/response";

const client = new PrismaClient();

const uploadData = asyncHandler(
  async (req: IRequest, res: Response): Promise<void> => {
    const userId = req.userId;
    const photo = req.file as Express.Multer.File;

    if (!photo) {
      throw new ValidationError("No file uploaded.");
    }

    if (!userId) {
      throw new UnauthorizedError("User ID missing.");
    }

    const photoUrl = (photo as any).path; // photo.path is full Cloudinary URL
    const { description } = req.body;

    if (!description) {
      throw new ValidationError("No description provided.");
    }

    const upload = await client.uploadData.create({
      data: {
        photo: photoUrl, // Cloudinary gives you a full URL here
        description,
        userId: Number(userId),
      },
    });

    sendSuccess(res, upload, "Uploaded Successfully");
  }
);

const viewUploadedData = asyncHandler(
  async (req: IRequest, res: Response): Promise<void> => {
    const userId = req.userId;

    const existingUser = await client.user.findUnique({
      where: {
        id: Number(userId),
      },
    });

    if (!existingUser) {
      throw new UnauthorizedError("User not found");
    }

    const data = await client.uploadData.findMany({
      where: {
        userId: Number(userId),
      },
    });

    sendSuccess(res, data, "Data fetched successfully");
  }
);

const viewSingleData = asyncHandler(
  async (req: IRequest, res: Response): Promise<void> => {
    const userId = req.userId;
    const { id } = req.params; //  Get data ID from URL

    const existingUser = await client.user.findUnique({
      where: {
        id: Number(userId),
      },
    });

    if (!existingUser) {
      throw new UnauthorizedError("User not found");
    }

    const data = await client.uploadData.findFirst({
      where: {
        id: Number(id),
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    if (data?.id !== Number(id)) {
      throw new NotFoundError("Not found any data");
    }

    sendSuccess(res, data, "Data fetched successfully");
  }
);

const editData = asyncHandler(
  async (req: IRequest, res: Response): Promise<void> => {
    const userId = req.userId; //logged in user
    const { uploadedId, description } = req.body;

    const existingUser = await client.user.findUnique({
      where: {
        id: Number(userId),
      },
    });
    //CHECK USER EXISTS OR NOT
    if (!existingUser) {
      throw new UnauthorizedError("User not found");
    }

    //CHECK WHETHERE THE UPLOADED USER IS SAME OR NOT
    const verifyUser = await client.uploadData.findFirst({
      where: {
        userId: Number(userId),
        id: uploadedId,
      },
    });

    if (!verifyUser) {
      throw new NotFoundError("No data found with this document ID");
    }

    //update data
    const updatedData = await client.uploadData.update({
      where: {
        id: uploadedId,
      },
      data: {
        description: description,
      },
    });

    sendSuccess(res, updatedData, "Updated Successfully");
  }
);

//DELETE DATA
const deleteData = asyncHandler(
  async (req: IRequest, res: Response): Promise<void> => {
    const userId = req.userId;
    const { uploadedId } = req.body;

    console.log("Received uploadedId:", uploadedId);

    // Verify that the photo belongs to the logged-in user
    const verifyUser = await client.uploadData.findFirst({
      where: {
        userId: Number(userId),
        id: uploadedId,
      },
    });

    if (!verifyUser) {
      throw new NotFoundError("No data found with this document ID");
    }

    //  Extract public_id from the photo URL
    const photoUrl = verifyUser.photo;
    const publicId = extractPublicIdFromUrl(photoUrl);

    //Transaction
    await client.$transaction(async (tx) => {
      //delete from cloudinary

      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }

      // delete from database
      await tx.uploadData.delete({
        where: {
          id: Number(uploadedId),
        },
      });
    });

    sendSuccess(
      res,
      { documentId: uploadedId },
      "Deleted Successfully from Cloudinary and database"
    );
  }
);

const getImagesUsingPagination = asyncHandler(
  async (req: IRequest, res: Response): Promise<void> => {
    const page = parseInt(req.query.page as string);
    const limit = parseInt(req.query.limit as string);

    const userId = req.userId;

    const existingUser = await client.user.findUnique({
      where: {
        id: Number(userId),
      },
    });

    if (!existingUser) {
      throw new UnauthorizedError("User does not exist");
    }

    const [images, total] = await Promise.all([
      client.uploadData.findMany({
        where: {
          userId: Number(userId),
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      client.uploadData.count({
        where: {
          userId: Number(userId),
        },
      }),
    ]);

    sendSuccess(
      res,
      {
        images,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      },
      "Images fetched successfully"
    );
  }
);

const uploadController = {
  uploadData,
  viewUploadedData,
  viewSingleData,
  editData,
  deleteData,

  getImagesUsingPagination,
};

export default uploadController;
