"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const shareValidation = {
    sharePhoto: {
        body: joi_1.default.object({
            receiverEmail: joi_1.default.string().email().required().messages({
                'any.required': 'Email is required',
                'string.email': 'Invalid email format',
            }),
            photoId: joi_1.default.number().required().messages({
                'any.required': 'Photo Id is required'
            })
        })
    }
};
exports.default = shareValidation;
