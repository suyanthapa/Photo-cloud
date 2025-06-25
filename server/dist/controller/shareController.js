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
const client = new client_1.PrismaClient();
const sharePhoto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { receiverEmail, photoId } = req.body;
        // const existingUser = await client.user.findUnique({
        //    where: {
        //       id: Number(receiverId)
        //      },
        //   }); 
        const receiverUser = yield client.user.findUnique({
            where: {
                email: receiverEmail
            },
        });
        //CHECK USER EXISTS OR NOT
        if (!receiverUser) {
            res.status(400).json({ error: "User doesnot exist" });
            return;
        }
        console.log("Receiver id is", receiverUser === null || receiverUser === void 0 ? void 0 : receiverUser.id);
        console.log("Mine id is", userId);
        //check photo exists or not
        const photo = yield client.uploadData.findFirst({
            where: { id: photoId }
        });
        if ((photo === null || photo === void 0 ? void 0 : photo.userId) !== Number(userId)) {
            res.status(400).json({
                error: "Respective Photo doesnot exist"
            });
            return;
        }
        if (receiverUser.id == Number(userId)) {
            res.status(400).json({
                error: "Photos can't be shared to yourself.. "
            });
        }
        //check if already shared or not
        const alreadyShared = yield client.userSharedPhotos.findUnique({
            where: {
                userId_uploadDataId: {
                    userId: receiverUser.id,
                    uploadDataId: photoId
                }
            }
        });
        if (alreadyShared) {
            res.status(400).json({
                error: "Photo already shared "
            });
        }
        //share photo to other
        const sharePhoto = yield client.userSharedPhotos.create({
            data: {
                userId: receiverUser.id,
                uploadDataId: photoId
            }
        });
        if (!sharePhoto) {
            res.status(400).json({
                error: " Sharing photos failed"
            });
        }
        res.status(200).json({ message: "Photos shared successfully" });
        return;
    }
    catch (e) {
        console.error("Upload error:", e);
        if (e instanceof Error) {
            res.status(500).json({ message: e.message });
        }
        else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
});
const viewSharedPhotos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loggedInUser = Number(req.userId);
        const existingUser = yield client.user.findUnique({
            where: {
                id: Number(loggedInUser)
            },
        });
        //CHECK USER EXISTS OR NOT
        if (!existingUser) {
            res.status(400).json({ error: "User doesnot exist" });
            return;
        }
        const viewSharedPhotos = yield client.userSharedPhotos.findMany({
            where: {
                uploadData: {
                    userId: loggedInUser
                }
            },
            select: {
                user: {
                    select: {
                        id: true,
                        username: true
                    }
                },
                uploadData: {
                    select: {
                        id: true,
                        photo: true,
                        description: true
                    }
                }
            }
        });
        res.status(200).json({
            message: "Views ",
            data: viewSharedPhotos
        });
        return;
    }
    catch (e) {
        console.error("Upload error:", e);
        if (e instanceof Error) {
            res.status(500).json({ message: e.message });
        }
        else {
            res.status(500).json({ message: "An unknown error occurred" });
        }
    }
});
const shareController = {
    sharePhoto,
    viewSharedPhotos
};
exports.default = shareController;
