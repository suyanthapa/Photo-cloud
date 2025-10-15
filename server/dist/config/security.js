"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSecurity = void 0;
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const setupSecurity = (server) => {
    // Helmet for security headers
    server.use((0, helmet_1.default)({
        crossOriginEmbedderPolicy: false,
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'"],
                imgSrc: ["'self'", "data:", "https:"],
            },
        },
    }));
    // CORS configuration
    const allowedOrigins = [
        "http://localhost:5173",
        "https://photo-cloud-delta.vercel.app",
    ];
    server.use((0, cors_1.default)({
        origin: allowedOrigins, // Remove the callback for stricter validation
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        maxAge: 86400, // Cache preflight for 24 hours
    }));
};
exports.setupSecurity = setupSecurity;
