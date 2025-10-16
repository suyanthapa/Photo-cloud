"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.errorHandler = void 0;
const errors_1 = require("../utils/errors");
const client_1 = require("@prisma/client");
const prismaErrorHandler_1 = require("../utils/prismaErrorHandler");
const stackParser_1 = require("../utils/stackParser");
const errorHandler = (error, req, res, next) => {
    let statusCode = 500;
    let message = "Internal Server Error";
    if (error instanceof errors_1.AppError) {
        statusCode = error.statusCode;
        message = error.message;
    }
    else if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        // Handle known Prisma errors
        const prismaHandled = (0, prismaErrorHandler_1.prismaErrorHandler)(error);
        statusCode = prismaHandled.statusCode;
        message = prismaHandled.message;
    }
    console.error(`[${new Date().toString()}] Error:`, {
        message: error.message,
        url: req.url,
        method: req.method,
    });
    //  API response
    const response = process.env.NODE_ENV === "development"
        ? { success: false, message, stack: (0, stackParser_1.parseStack)(error.stack) } // dev sees details
        : { success: false, message }; // prod safe
    res.status(statusCode).json(response);
};
exports.errorHandler = errorHandler;
const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
    });
};
exports.notFoundHandler = notFoundHandler;
