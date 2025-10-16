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
exports.sendEmail = sendEmail;
exports.emailTemplateVerify = emailTemplateVerify;
exports.emailTemplateForgotPassword = emailTemplateForgotPassword;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
    host: process.env.MAILGUN_HOST,
    port: parseInt(process.env.MAILGUN_PORT || "587"),
    auth: {
        user: process.env.MAILGUN_USERNAME,
        pass: process.env.MAILGUN_PASSWORD,
    },
    secure: false, // Mailgun uses STARTTLS on port 587
});
function sendEmail(to, subject, html, text) {
    return __awaiter(this, void 0, void 0, function* () {
        const info = yield transporter.sendMail({
            from: `"photoCloud" <${process.env.MAILGUN_USERNAME}>`,
            to,
            subject,
            text,
            html,
        });
        console.log("Message sent: %s", info.messageId);
        return info;
    });
}
//predefined templates
function emailTemplateVerify(token) {
    const subject = "Verify your Email";
    const text = `Use this OTP to verify your email: ${token}`;
    const html = `<p>Dear User,</p>
    <p>Please use the following OTP to verify your email address:</p>
    <p><b style="font-size: 20px;">${token}</b></p>
    <p>Do not share this OTP with anyone.</p>`;
    return { subject, text, html };
}
function emailTemplateForgotPassword(token) {
    const subject = "Password Recovery - Verify Your Email";
    const text = `Use this OTP to reset your password: ${token}`;
    const html = `<p>Dear User,</p>
    <p>Please use the following OTP to reset your password:</p>
    <p><b style="font-size: 20px;">${token}</b></p>
    <p>Do not share this OTP with anyone.</p>`;
    return { subject, text, html };
}
