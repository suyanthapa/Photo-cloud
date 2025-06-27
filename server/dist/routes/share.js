"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jwtfromUser_1 = __importDefault(require("../Middleware/jwtfromUser"));
const shareController_1 = __importDefault(require("../controller/shareController"));
const validation_1 = __importDefault(require("../Middleware/validation"));
const share_1 = __importDefault(require("../Validation/share"));
const sharedRouter = (0, express_1.Router)();
sharedRouter.post('/sharePhoto', jwtfromUser_1.default, (0, validation_1.default)(share_1.default.sharePhoto), shareController_1.default.sharePhoto);
sharedRouter.get('/viewSharedPhotos', jwtfromUser_1.default, shareController_1.default.viewSharedPhotos);
sharedRouter.get('/sharedPhotos', jwtfromUser_1.default, shareController_1.default.sharedToMe);
exports.default = sharedRouter;
