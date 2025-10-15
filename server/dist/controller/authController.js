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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userHelper_1 = require("../utils/userHelper");
const otpService_1 = require("../services/otpService");
const userService_1 = require("../services/userService");
const asyncHandler_1 = require("../utils/asyncHandler");
const errors_1 = require("../utils/errors");
const response_1 = require("../utils/response");
const client = new client_1.PrismaClient();
dotenv_1.default.config(); // Load .env variables
//regiser
const register = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, username, password } = req.body;
    const existingUser = yield (0, userHelper_1.findUserByEmail)(email);
    if (existingUser) {
        throw new errors_1.ConflictError("User already exists");
    }
    // Hash password
    const hashedPassword = yield bcrypt_1.default.hash(password, 10); // 10 = salt rounds
    console.log("Hashed pw is", hashedPassword);
    //  Create new user
    const user = yield client.user.create({
        data: { email, username, password: hashedPassword },
    });
    //send  verify otp
    yield (0, otpService_1.createAndSendOTP)(email, "verify", user.id);
    (0, response_1.sendSuccess)(res, {
        user: {
            id: user.id,
            email: user.email,
            username: user.username,
        },
    }, "User Created and Mail sent successfully", 201);
}));
//login
const login = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const existingUser = yield (0, userHelper_1.findUserByEmail)(email);
    if (!existingUser) {
        throw new errors_1.NotFoundError("User");
    }
    // Compare password with hashed password
    const isPasswordValid = yield bcrypt_1.default.compare(password, existingUser.password);
    if (!isPasswordValid) {
        throw new errors_1.UnauthorizedError("Invalid Login Credentials");
    }
    if (existingUser.isEmailVerified === false) {
        //send  verify otp
        yield (0, otpService_1.createAndSendOTP)(email, "verify", existingUser.id);
        throw new errors_1.AppError("Please verify your email. OTP sent again.", 400);
    }
    //generate token
    const token = jsonwebtoken_1.default.sign({
        userId: existingUser.id,
    }, process.env.JWT_SECRET, { expiresIn: "7d" });
    console.log("The token is ", token);
    res.cookie("uid", token, {
        httpOnly: true,
        secure: true, // true on https only
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    (0, response_1.sendSuccess)(res, {
        token,
        user: {
            id: existingUser.id,
            username: existingUser.username,
            email: existingUser.email,
        },
    }, "Logged in successfully", 200);
}));
//verify email from  OTP
const verifyInputOTP = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    const result = yield (0, otpService_1.verifyOTP)(email, otp);
    if (!result.valid) {
        throw new errors_1.ValidationError(result.message || "Invalid verification code");
    }
    // Mark user as verified
    const user = yield (0, userHelper_1.findUserByEmail)(email);
    if (!user) {
        throw new errors_1.NotFoundError("User");
    }
    if (user.isEmailVerified === false) {
        yield (0, userService_1.markUserVerified)(email);
    }
    yield client.emailVerification.deleteMany({
        where: { email },
    });
    (0, response_1.sendSuccess)(res, null, "Email verified successfully");
}));
//for forgot password otp verification
const verifyForgotPasswordOtp = verifyInputOTP;
const forgotPassword = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield (0, userHelper_1.findUserByEmail)(email);
    if (!user) {
        throw new errors_1.NotFoundError("User");
    }
    // check if OTP already exists for this email & delete it
    const existingOTP = yield client.emailVerification.findFirst({
        where: { email, used: false },
    });
    if (existingOTP) {
        yield client.emailVerification.deleteMany({
            where: { email },
        });
    }
    //create and send otp
    yield (0, otpService_1.createAndSendOTP)(email, "forgot", user.id);
    (0, response_1.sendSuccess)(res, null, "Otp Sent Successfully");
}));
// Reset Password ( changepassword )
const resetPassword = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, confirmPassword } = req.body;
    const existingUser = yield (0, userHelper_1.findUserByEmail)(email);
    if (!existingUser) {
        throw new errors_1.NotFoundError("User");
    }
    if (password != confirmPassword) {
        throw new errors_1.ValidationError("Password don't match");
    }
    //  Hash password
    const hashedPassword = yield bcrypt_1.default.hash(password, 10); // 10 = salt rounds
    yield client.user.update({
        where: { id: existingUser.id },
        data: {
            password: hashedPassword,
        },
    });
    (0, response_1.sendSuccess)(res, null, "Password reset successfully");
}));
//logout
const logout = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("uid", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
    (0, response_1.sendSuccess)(res, null, "Logged out successfully");
}));
const updatePassword = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = Number(req.userId);
    const { currentPassword, newPassword, confirmPassword } = req.body;
    if (!userId) {
        throw new errors_1.UnauthorizedError("Unauthorized: User ID missing");
    }
    const user = yield client.user.findUnique({
        where: { id: Number(userId) },
    });
    if (!user) {
        throw new errors_1.NotFoundError("User");
    }
    // Compare current password with hashed password
    const isPasswordValid = yield bcrypt_1.default.compare(currentPassword, user.password);
    if (!isPasswordValid) {
        throw new errors_1.UnauthorizedError("Invalid current password");
    }
    if (newPassword != confirmPassword) {
        throw new errors_1.ValidationError("Password don't match");
    }
    //  Hash password
    const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10); // 10 = salt rounds
    yield client.user.update({
        where: { id: Number(userId) },
        data: {
            password: hashedPassword,
        },
    });
    (0, response_1.sendSuccess)(res, null, "Password updated successfully");
}));
const me = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = Number(req.userId);
    if (!userId) {
        throw new errors_1.UnauthorizedError("Unauthorized: User ID missing");
    }
    const user = yield client.user.findUnique({
        where: { id: Number(userId) },
    });
    if (!user) {
        throw new errors_1.NotFoundError("User");
    }
    //extracct name , email, isEmailVerified
    const { id, username, email, isEmailVerified, createdAt } = user;
    (0, response_1.sendSuccess)(res, { id, username, email, isEmailVerified, createdAt }, "Profile shown successfully");
}));
const authController = {
    register,
    login,
    verifyInputOTP,
    forgotPassword,
    verifyForgotPasswordOtp,
    resetPassword,
    logout,
    updatePassword,
    me,
};
exports.default = authController;
