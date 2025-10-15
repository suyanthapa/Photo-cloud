"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generalLimiter = exports.authLimiter = exports.otpLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
exports.otpLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000, // 1 minute
    max: 3, // 3 OTP attempts per minute
    message: {
        message: "Too many OTP requests, please wait",
    },
    standardHeaders: true,
    legacyHeaders: false,
});
exports.authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // 20 login attempts
    message: {
        message: "Too many authentication attempts, try again later",
    },
    standardHeaders: true,
    legacyHeaders: false,
});
exports.generalLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per 15 minutes
    message: {
        message: "Too many requests, please slow down",
    },
    standardHeaders: true,
    legacyHeaders: false,
});
