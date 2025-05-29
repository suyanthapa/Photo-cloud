"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userUpload = void 0;
const express_1 = __importDefault(require("express"));
const multerConfig_1 = __importDefault(require("../Middleware/multerConfig"));
const uploadController_1 = __importDefault(require("../controller/uploadController"));
const jwtfromUser_1 = __importDefault(require("../Middleware/jwtfromUser"));
const uploadRouter = express_1.default.Router();
exports.userUpload = multerConfig_1.default.fields([
    { name: 'photo', maxCount: 1 }
]);
//Upload  User Photo
uploadRouter.post('/upload', exports.userUpload, jwtfromUser_1.default, uploadController_1.default.uploadData);
//view uploaded data
uploadRouter.get('/viewData', jwtfromUser_1.default, uploadController_1.default.viewUploadedData);
//edit uploaded data
uploadRouter.put('/editData', jwtfromUser_1.default, uploadController_1.default.editData);
//delete uploaded data
uploadRouter.delete('/deleteData', jwtfromUser_1.default, uploadController_1.default.deleteData);
exports.default = uploadRouter;
