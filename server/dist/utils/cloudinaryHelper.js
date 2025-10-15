"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPublicIdFromUrl = extractPublicIdFromUrl;
function extractPublicIdFromUrl(url) {
    try {
        const urlParts = url.split('/');
        const fileName = urlParts.pop(); // abc123xyz.png
        const folder = urlParts.pop(); // uploads
        const publicId = `${folder}/${fileName === null || fileName === void 0 ? void 0 : fileName.split('.')[0]}`; // uploads/abc123xyz
        return publicId;
    }
    catch (error) {
        console.error("Failed to extract publicId from URL:", error);
        return null;
    }
}
