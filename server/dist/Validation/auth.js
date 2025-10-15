"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const userValidation = {
    register: {
        body: joi_1.default.object({
            email: joi_1.default.string().email().required().messages({
                "any.required": "Email is required",
                "string.email": "Invalid email format",
            }),
            username: joi_1.default.string().min(3).required().messages({
                "any.required": "Username is required",
                "string.min": "Username must be at least 3 characters",
            }),
            password: joi_1.default.string().min(6).required().messages({
                "any.required": "Password is required",
                "string.min": "Password must be at least 6 characters",
            }),
        }),
    },
    login: {
        body: joi_1.default.object({
            email: joi_1.default.string().email().required().messages({
                "any.required": "Email is required",
                "string.email": "Invalid email format",
            }),
            password: joi_1.default.string().min(6).required().messages({
                "any.required": "Password is required",
                "string.min": "Password must be at least 6 characters",
            }),
        }),
    },
    verifyOTP: {
        body: joi_1.default.object({
            email: joi_1.default.string().email().required().messages({
                "any.required": "Email is required",
                "string.email": "Invalid email format",
            }),
            otp: joi_1.default.string().min(6).max(6).required().messages({
                "any.required": "OTP is required",
                "string.min": "OTP must be at least 6 characters",
            }),
        }),
    },
    resetPassword: {
        body: joi_1.default.object({
            email: joi_1.default.string().email().required().messages({
                "any.required": "Email is required",
                "string.email": "Invalid email format",
            }),
            password: joi_1.default.string().min(6).required().messages({
                "any.required": "Password is required",
                "string.min": "Password must be at least 6 characters",
            }),
            confirmPassword: joi_1.default.string().min(6).required().messages({
                "any.required": "Confirm Password is required",
                "string.min": "Confirm Password must be at least 6 characters",
            }),
        }),
    },
    updatePassword: {
        body: joi_1.default.object({
            currentPassword: joi_1.default.string().min(6).required().messages({
                "any.required": "Current Password is required",
                "string.min": " Current Password must be at least 6 characters",
            }),
            newPassword: joi_1.default.string().min(6).required().messages({
                "any.required": "New Password is required",
                "string.min": "New Password must be at least 6 characters",
            }),
            confirmPassword: joi_1.default.string().min(6).required().messages({
                "any.required": "Confirm Password is required",
                "string.min": "Confirm Password must be at least 6 characters",
            }),
        }),
    },
};
exports.default = userValidation;
