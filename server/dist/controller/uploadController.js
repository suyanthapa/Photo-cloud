"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const cloudinary_1 = require("../utils/cloudinary");
const cloudinaryHelper_1 = require("../utils/cloudinaryHelper");
const asyncHandler_1 = require("../utils/asyncHandler");
const errors_1 = require("../utils/errors");
const response_1 = require("../utils/response");
const client = new client_1.PrismaClient();
const uploadData = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const photo = req.file;
    if (!photo) {
        throw new errors_1.ValidationError("No file uploaded.");
    }
    if (!userId) {
        throw new errors_1.UnauthorizedError("User ID missing.");
    }
    const photoUrl = photo.path; // photo.path is full Cloudinary URL
    const { description } = req.body;
    if (!description) {
        throw new errors_1.ValidationError("No description provided.");
    }
    const upload = yield client.uploadData.create({
        data: {
            photo: photoUrl, // Cloudinary gives you a full URL here
            description,
            userId: Number(userId),
        },
    });
    (0, response_1.sendSuccess)(res, upload, "Uploaded Successfully");
}));
const viewUploadedData = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const existingUser = yield client.user.findUnique({
        where: {
            id: Number(userId),
        },
    });
    if (!existingUser) {
        throw new errors_1.UnauthorizedError("User not found");
    }
    const data = yield client.uploadData.findMany({
        where: {
            userId: Number(userId),
        },
    });
    (0, response_1.sendSuccess)(res, data, "Data fetched successfully");
}));
const viewSingleData = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const { id } = req.params; //  Get data ID from URL
    const existingUser = yield client.user.findUnique({
        where: {
            id: Number(userId),
        },
    });
    if (!existingUser) {
        throw new errors_1.UnauthorizedError("User not found");
    }
    const data = yield client.uploadData.findFirst({
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
    if ((data === null || data === void 0 ? void 0 : data.id) !== Number(id)) {
        throw new errors_1.NotFoundError("Not found any data");
    }
    (0, response_1.sendSuccess)(res, data, "Data fetched successfully");
}));
const editData = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId; //logged in user
    const { uploadedId, description } = req.body;
    const existingUser = yield client.user.findUnique({
        where: {
            id: Number(userId),
        },
    });
    //CHECK USER EXISTS OR NOT
    if (!existingUser) {
        throw new errors_1.UnauthorizedError("User not found");
    }
    //CHECK WHETHERE THE UPLOADED USER IS SAME OR NOT
    const verifyUser = yield client.uploadData.findFirst({
        where: {
            userId: Number(userId),
            id: uploadedId,
        },
    });
    if (!verifyUser) {
        throw new errors_1.NotFoundError("No data found with this document ID");
    }
    //update data
    const updatedData = yield client.uploadData.update({
        where: {
            id: uploadedId,
        },
        data: {
            description: description,
        },
    });
    (0, response_1.sendSuccess)(res, updatedData, "Updated Successfully");
}));
//DELETE DATA
const deleteData = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const { uploadedId } = req.body;
    console.log("Received uploadedId:", uploadedId);
    // Verify that the photo belongs to the logged-in user
    const verifyUser = yield client.uploadData.findFirst({
        where: {
            userId: Number(userId),
            id: uploadedId,
        },
    });
    if (!verifyUser) {
        throw new errors_1.NotFoundError("No data found with this document ID");
    }
    //  Extract public_id from the photo URL
    const photoUrl = verifyUser.photo;
    const publicId = (0, cloudinaryHelper_1.extractPublicIdFromUrl)(photoUrl);
    //Transaction
    yield client.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        //delete from cloudinary
        if (publicId) {
            yield cloudinary_1.cloudinary.uploader.destroy(publicId);
        }
        // delete from database
        yield tx.uploadData.delete({
            where: {
                id: Number(uploadedId),
            },
        });
    }));
    (0, response_1.sendSuccess)(res, { documentId: uploadedId }, "Deleted Successfully from Cloudinary and database");
}));
const getImagesUsingPagination = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const userId = req.userId;
    const existingUser = yield client.user.findUnique({
        where: {
            id: Number(userId),
        },
    });
    if (!existingUser) {
        throw new errors_1.UnauthorizedError("User does not exist");
    }
    const [images, total] = yield Promise.all([
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
    (0, response_1.sendSuccess)(res, {
        images,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
    }, "Images fetched successfully");
}));
const uploadController = {
    uploadData,
    viewUploadedData,
    viewSingleData,
    editData,
    deleteData,
    getImagesUsingPagination,
};
exports.default = uploadController;
