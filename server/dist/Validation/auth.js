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
                'any.required': 'Email is required',
                'string.email': 'Invalid email format',
            }),
            username: joi_1.default.string().min(3).required().messages({
                'any.required': 'Username is required',
                'string.min': 'Username must be at least 3 characters',
            }),
            password: joi_1.default.string().min(6).required().messages({
                'any.required': 'Password is required',
                'string.min': 'Password must be at least 6 characters',
            }),
        }),
    },
    login: {
        body: joi_1.default.object({
            email: joi_1.default.string().email().required().messages({
                'any.required': 'Email is required',
                'string.email': 'Invalid email format',
            }),
            password: joi_1.default.string().min(6).required().messages({
                'any.required': 'Password is required',
                'string.min': 'Password must be at least 6 characters',
            }),
        }),
    }
};
exports.default = userValidation;
