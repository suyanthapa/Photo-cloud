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
exports.verifyOTP = exports.createAndSendOTP = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const mailer_1 = require("./mailer");
const errors_1 = require("../utils/errors");
const prisma = new client_1.PrismaClient();
//genertae 6-digitOTP
function generateToken() {
    return (100000 + Math.floor(Math.random() * 900000)).toString();
}
//create and send otp
const createAndSendOTP = function (email, type, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = generateToken();
            const hashedToken = yield bcrypt_1.default.hash(token, 10);
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000); //10minutes
            //Use upsert to handle the unique constraint - update if exists, create if not
            yield prisma.emailVerification.upsert({
                where: { email },
                update: {
                    otp: hashedToken,
                    expiresAt,
                    used: false,
                    userId: userId || null,
                    createdAt: new Date(), // Reset created time for new OTP
                },
                create: {
                    email,
                    otp: hashedToken,
                    expiresAt,
                    used: false,
                    userId: userId || null,
                },
            });
            //CHOOSE EMAIL TEMPLATE
            const template = type === "verify"
                ? (0, mailer_1.emailTemplateVerify)(token)
                : (0, mailer_1.emailTemplateForgotPassword)(token);
            // Send email with error handling
            try {
                yield (0, mailer_1.sendEmail)(email, template.subject, template.html, template.text);
            }
            catch (emailError) {
                // If email fails, we should still clean up the OTP
                yield prisma.emailVerification
                    .delete({
                    where: { email },
                })
                    .catch(() => { }); // Silent cleanup if it fails
                console.error("Email sending failed:", emailError);
                throw new errors_1.EmailServiceError("Failed to send verification email");
            }
            return token;
        }
        catch (error) {
            if (error instanceof errors_1.EmailServiceError) {
                throw error;
            }
            // Handle database errors
            console.error("OTP creation failed:", error);
            throw new errors_1.OTPServiceError("Failed to create verification code");
        }
    });
};
exports.createAndSendOTP = createAndSendOTP;
//Verify OTP
const verifyOTP = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const otpDoc = yield prisma.emailVerification.findUnique({
            where: { email },
        });
        if (!otpDoc || !otpDoc.otp) {
            return { valid: false, message: "OTP not found" };
        }
        // Check if OTP is already used
        if (otpDoc.used) {
            return { valid: false, message: "OTP already used" };
        }
        // Check if OTP is expired
        if (otpDoc.expiresAt < new Date()) {
            yield prisma.emailVerification
                .delete({
                where: { email },
            })
                .catch(() => { }); // Silent cleanup
            return {
                valid: false,
                message: "Verification OTP expired",
            };
        }
        // ensure OTP is string
        const otpToCompare = otp.toString();
        const hashedOTP = otpDoc.otp;
        const isValid = yield bcrypt_1.default.compare(otpToCompare, hashedOTP);
        if (!isValid)
            return { valid: false, message: "Invalid OTP" };
        //mark otp as used
        yield prisma.emailVerification.update({
            where: {
                email: email,
            },
            data: { used: true },
        });
        return { valid: true, userId: otpDoc.userId };
    }
    catch (error) {
        console.error("OTP verification failed:", error);
        throw new errors_1.OTPServiceError("Failed to verify code");
    }
});
exports.verifyOTP = verifyOTP;
