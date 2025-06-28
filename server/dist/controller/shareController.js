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
        const receiverUser = yield client.user.findUnique({
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
        const photo = yield client.uploadData.findUnique({
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
        yield client.uploadData.update({
            where: { id: photoId },
            data: {
                sharedWith: {
                    push: receiverUser.id,
                },
            },
        });
        res.status(200).json({ message: "Photo shared successfully" });
    }
    catch (e) {
        console.error("Share error:", e);
        res.status(500).json({
            message: e instanceof Error ? e.message : "An unknown error occurred",
        });
    }
});
const viewSharedPhotos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loggedInUserId = Number(req.userId);
        const myPhotos = yield client.uploadData.findMany({
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
        const users = yield client.user.findMany({
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
        const userMap = Object.fromEntries(users.map(user => [user.id, { username: user.username, email: user.email }]));
        const formatted = myPhotos.flatMap(photo => photo.sharedWith.map(userId => {
            var _a, _b;
            return ({
                uploadData: {
                    id: photo.id,
                    photo: photo.photo,
                    description: photo.description,
                },
                user: {
                    id: userId,
                    username: ((_a = userMap[userId]) === null || _a === void 0 ? void 0 : _a.username) || "Unknown",
                    email: ((_b = userMap[userId]) === null || _b === void 0 ? void 0 : _b.email) || "N/A",
                },
            });
        }));
        res.status(200).json({
            message: "Your shared photos",
            data: formatted,
        });
    }
    catch (e) {
        console.error("ViewSharedPhotos error:", e);
        res.status(500).json({
            message: e instanceof Error ? e.message : "An unknown error occurred",
        });
    }
});
const sharedToMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loggedInUserId = Number(req.userId);
        const sharedPhotos = yield client.uploadData.findMany({
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
    }
    catch (e) {
        console.error("SharedToMe error:", e);
        res.status(500).json({
            message: e instanceof Error ? e.message : "An unknown error occurred",
        });
    }
});
const shareController = {
    sharePhoto,
    viewSharedPhotos,
    sharedToMe
};
exports.default = shareController;
