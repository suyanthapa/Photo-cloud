"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccess = void 0;
const sendSuccess = (res, data, message, statusCode = 200) => {
    const response = {
        success: true,
        data,
        message,
    };
    res.status(statusCode).json(response);
};
exports.sendSuccess = sendSuccess;
