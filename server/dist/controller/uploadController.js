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
const viewSingleData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { id } = req.params; //  Get data ID from URL
        const existingUser = yield client.user.findUnique({
            where: {
                id: Number(userId)
            },
        });
        if (!existingUser) {
            res.status(400).json({ error: "User doesnot exist" });
            return;
        }
        const data = yield client.uploadData.findFirst({
            where: {
                id: Number(id)
            },
            include: {
                user: {
                    select: {
                        email: true
                    }
                }
            }
        });
        if ((data === null || data === void 0 ? void 0 : data.id) !== Number(id)) {
            res.status(400).json({
                error: "Not found any data"
            });
        }
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
const editData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId; //logged in user
        const { uploadedId, description } = req.body;
        const existingUser = yield client.user.findUnique({
            where: {
                id: Number(userId)
            },
        });
        //CHECK USER EXISTS OR NOT
        if (!existingUser) {
            res.status(400).json({ error: "User doesnot exist" });
            return;
        }
        //CHECK WHETHERE THE UPLOADED USER IS SAME OR NOT
        const verifyUser = yield client.uploadData.findFirst({
            where: {
                userId: Number(userId),
                id: uploadedId
            }
        });
        if (!verifyUser) {
            res.status(404).json({ error: "not found any data with this document id" });
            return;
        }
        //update data
        const updatedData = yield client.uploadData.update({
            where: {
                id: uploadedId
            },
            data: {
                description: description
            }
        });
        console.log("The updated data is", updatedData);
        res.status(200).json({
            message: "Updated Successfully",
            data: updatedData,
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
//DELETE DATA
const deleteData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
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
            res.status(404).json({ error: "No data found with this document ID" });
            return;
        }
        const deleted = yield client.uploadData.delete({
            where: {
                id: uploadedId,
            },
        });
        res.status(200).json({
            message: "Deleted Successfully",
            documentId: uploadedId,
        });
    }
    catch (e) {
        console.error("Delete Data Error:", e);
        res.status(500).json({
            message: e instanceof Error ? e.message : "An unknown error occurred",
        });
    }
});
const uploadController = {
    uploadData,
    viewUploadedData,
    viewSingleData,
    editData,
    deleteData
};
exports.default = uploadController;
