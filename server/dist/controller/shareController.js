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
    const userId = req.userId;
    const { receiverId, photoId } = req.body;
    const existingUser = yield client.user.findUnique({
        where: {
            id: Number(receiverId)
        },
    });
    //CHECK USER EXISTS OR NOT
    if (!existingUser) {
        res.status(400).json({ error: "User doesnot exist" });
        return;
    }
    console.log("Receiver id is", receiverId);
    console.log("Mine id is", userId);
    //check photo exists or not
    const photo = yield client.uploadData.findFirst({
        where: { id: photoId }
    });
    if ((photo === null || photo === void 0 ? void 0 : photo.userId) !== userId) {
        res.status(400).json({
            error: "Respective Photo doesnot exist"
        });
    }
    if (receiverId === userId) {
        res.status(400).json({
            error: "Photos can't be shared to yourself.. "
        });
    }
    //check if already shared or not
    const alreadyShared = yield client.userSharedPhotos.findUnique({
        where: {
            userId_uploadDataId: {
                userId: receiverId,
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
            userId: receiverId,
            uploadDataId: photoId
        }
    });
    if (!sharePhoto) {
        res.status(400).json({
            error: " Sharing photos failed"
        });
    }
    res.status(200).json({ message: "Photos shared successfully" });
});
const shareController = {
    sharePhoto
};
exports.default = shareController;
