"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = __importDefault(require("../controller/authController"));
const auth_1 = __importDefault(require("../Validation/auth"));
const validation_1 = __importDefault(require("../Middleware/validation"));
const jwtfromUser_1 = __importDefault(require("../Middleware/jwtfromUser"));
const rateLimiter_1 = require("../Middleware/rateLimiter");
const authRouter = express_1.default.Router();
//Login User
authRouter.post("/login", rateLimiter_1.authLimiter, (0, validation_1.default)(auth_1.default.login), authController_1.default.login);
//Login User
authRouter.post("/", rateLimiter_1.authLimiter, (0, validation_1.default)(auth_1.default.login), authController_1.default.login);
//register user
authRouter.post("/register", rateLimiter_1.generalLimiter, (0, validation_1.default)(auth_1.default.register), authController_1.default.register);
//  verify OTP
authRouter.post("/verify-otp", rateLimiter_1.authLimiter, (0, validation_1.default)(auth_1.default.verifyOTP), authController_1.default.verifyInputOTP);
//forgot password --sends otp
authRouter.post("/forgot-password", rateLimiter_1.otpLimiter, authController_1.default.forgotPassword);
//reset password
authRouter.post("/reset-password", (0, validation_1.default)(auth_1.default.resetPassword), authController_1.default.resetPassword);
//logout
authRouter.post("/logout", jwtfromUser_1.default, authController_1.default.logout);
//reset password
authRouter.post("/update-password", jwtfromUser_1.default, (0, validation_1.default)(auth_1.default.updatePassword), authController_1.default.updatePassword);
//view profile
authRouter.get("/me", jwtfromUser_1.default, authController_1.default.me);
exports.default = authRouter;
