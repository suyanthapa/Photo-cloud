"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const validate = (validationSchemas = {}) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { body, params, query, headers } = validationSchemas;
        try {
            if (body) {
                const validationResult = body.validate(req.body, { abortEarly: false });
                if (validationResult.error)
                    throw validationResult.error;
            }
            if (params) {
                const validationResult = params.validate(req.params, { abortEarly: false });
                if (validationResult.error)
                    throw validationResult.error;
            }
            if (query) {
                const validationResult = query.validate(req.query, { abortEarly: false });
                if (validationResult.error)
                    throw validationResult.error;
            }
            if (headers) {
                const validationResult = headers.validate(req.headers, { abortEarly: false });
                if (validationResult.error)
                    throw validationResult.error;
            }
            next();
        }
        catch (error) {
            if (error instanceof Error) {
                console.error('Validation error:', error);
                res.status(400).json({
                    error: error.message,
                    details: (error === null || error === void 0 ? void 0 : error.details) || null
                });
            }
            else {
                console.error('Unexpected validation error:', error);
                res.status(500).json({ error: 'An unexpected error occurred during validation' });
            }
        }
    });
};
exports.default = validate;
