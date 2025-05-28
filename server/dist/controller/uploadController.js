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
const uploadData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const userId = req.userId;
        // Access the file from req.files, not req.body
        const photo = (_b = (_a = req.files) === null || _a === void 0 ? void 0 : _a.photo) === null || _b === void 0 ? void 0 : _b[0];
        const { description } = req.body;
        console.log("body is", req.body);
        console.log("The file is", photo);
        console.log("The description is ", description);
        console.log("The USERiD is", userId);
        if (!photo) {
            res.status(400).json({ message: "No file uploaded." });
            return;
        }
        if (!description || !userId) {
            res.status(400).json({ message: "Missing description or userId." });
            return;
        }
        const upload = yield client.uploadData.create({
            data: {
                photo: photo.filename,
                description,
                userId: Number(userId)
            }
        });
        res.status(201).json({
            message: "Uploaded Sucessfully",
            data: upload
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
const viewUploadedData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const existingUser = yield client.user.findUnique({
            where: {
                id: Number(userId)
            },
        });
        if (!existingUser) {
            res.status(400).json({ error: "User doesnot exist" });
            return;
        }
        const data = yield client.uploadData.findMany({
            where: {
                userId: Number(userId)
            }
        });
        console.log("The uploaded data is:", data);
        res.status(201).json({
            data
        });
        return;
    }
    catch (e) {
        console.error("View Uploaded Data Error:", e);
        if (e instanceof Error) {
            res.status(500).json({ message: e.message });
        }
        else {
            res.status(500).json({ message: "An unknown erro occured" });
        }
    }
});
const uploadController = {
    uploadData,
    viewUploadedData
};
exports.default = uploadController;
