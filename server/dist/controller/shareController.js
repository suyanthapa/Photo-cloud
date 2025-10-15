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
const asyncHandler_1 = require("../utils/asyncHandler");
const errors_1 = require("../utils/errors");
const response_1 = require("../utils/response");
const client = new client_1.PrismaClient();
const sharePhoto = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const { receiverEmail, photoId } = req.body;
    const receiverUser = yield client.user.findUnique({
        where: { email: receiverEmail },
    });
    if (!receiverUser) {
        throw new errors_1.NotFoundError("User does not exist");
    }
    if (receiverUser.id === Number(userId)) {
        throw new errors_1.ValidationError("Cannot share photo with yourself");
    }
    const photo = yield client.uploadData.findUnique({
        where: { id: photoId },
        select: {
            id: true,
            userId: true,
        },
    });
    if (!photo || photo.userId !== Number(userId)) {
        throw new errors_1.UnauthorizedError("You do not own this photo or it doesn't exist");
    }
    const alreadyShared = yield client.photoShare.findFirst({
        where: {
            photoId,
            sharedWith: receiverEmail,
        },
    });
    if (alreadyShared) {
        throw new errors_1.ConflictError("Photo already shared with this email");
    }
    // Save share record
    yield client.photoShare.create({
        data: {
            photoId,
            sharedById: Number(userId),
            sharedWith: receiverEmail,
        },
    });
    (0, response_1.sendSuccess)(res, null, "Photo shared successfully");
}));
const viewSharedPhotos = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loggedInUserId = Number(req.userId);
    //Find all PhotoShare records where the current user shared the photo
    const shares = yield client.photoShare.findMany({
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
    (0, response_1.sendSuccess)(res, formatted, "Your shared photos");
}));
const sharedToMe = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loggedInUserId = Number(req.userId);
    // First get current user's email in a single optimized query
    const currentUser = yield client.user.findUnique({
        where: { id: loggedInUserId },
        select: { email: true },
    });
    if (!currentUser) {
        throw new errors_1.NotFoundError("User not found");
    }
    // Optimized: Single query with all required includes to avoid N+1
    const sharedPhotos = yield client.photoShare.findMany({
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
    (0, response_1.sendSuccess)(res, formatted, "Photos shared with you");
}));
const shareController = {
    sharePhoto,
    viewSharedPhotos,
    sharedToMe,
};
exports.default = shareController;
