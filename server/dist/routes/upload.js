"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userUpload = void 0;
const express_1 = __importDefault(require("express"));
const multerConfig_1 = __importDefault(require("../Middleware/multerConfig"));
const uploadController_1 = __importDefault(require("../controller/uploadController"));
const uploadRouter = express_1.default.Router();
exports.userUpload = multerConfig_1.default.fields([
    { name: 'photo', maxCount: 1 }
]);
//Upload  User Photo
uploadRouter.post('/upload', exports.userUpload, uploadController_1.default.uploadData);
exports.default = uploadRouter;
