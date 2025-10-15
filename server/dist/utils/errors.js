"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTPServiceError = exports.EmailServiceError = exports.ServiceError = exports.ConflictError = exports.NotFoundError = exports.UnauthorizedError = exports.ValidationError = exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode = 500, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
class ValidationError extends AppError {
    constructor(message) {
        super(message, 400);
    }
}
exports.ValidationError = ValidationError;
class UnauthorizedError extends AppError {
    constructor(message = "Unauthorized") {
        super(message, 401);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class NotFoundError extends AppError {
    constructor(resource) {
        super(`${resource} not found`, 404);
    }
}
exports.NotFoundError = NotFoundError;
class ConflictError extends AppError {
    constructor(message) {
        super(message, 409);
    }
}
exports.ConflictError = ConflictError;
//otp
class ServiceError extends AppError {
    constructor(message, statusCode = 500) {
        super(message, statusCode);
    }
}
exports.ServiceError = ServiceError;
class EmailServiceError extends ServiceError {
    constructor(message = "Email service failed") {
        super(message, 503); // Service Unavailable
    }
}
exports.EmailServiceError = EmailServiceError;
class OTPServiceError extends ServiceError {
    constructor(message) {
        super(message, 400);
    }
}
exports.OTPServiceError = OTPServiceError;
