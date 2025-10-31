import { PrismaClient } from "@prisma/client";

import bcrypt from "bcrypt";
import {
  emailTemplateForgot as emailTemplateForgotPassword,
  emailTemplateVerify,
  sendEmail,
} from "./mailer_gmail";
import { EmailServiceError, OTPServiceError } from "../utils/errors";

interface VerifyOTPResult {
  valid: boolean;
  message?: string;
  userId?: number;
}
const prisma = new PrismaClient();

//genertae 6-digitOTP

function generateToken(): string {
  return (100000 + Math.floor(Math.random() * 900000)).toString();
}

//create and send otp
export const createAndSendOTP = async function (
  email: string,
  type: "verify" | "forgot",
  userId?: number
): Promise<string> {
  try {
    const token = generateToken();
    const hashedToken = await bcrypt.hash(token, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); //10minutes

    //Use upsert to handle the unique constraint - update if exists, create if not
    await prisma.emailVerification.upsert({
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
    const template =
      type === "verify"
        ? emailTemplateVerify(token)
        : emailTemplateForgotPassword(token);

    // Send email with error handling
    try {
      await sendEmail(email, template.subject, template.html, template.text);
    } catch (emailError) {
      // If email fails,  still clean up the OTP
      await prisma.emailVerification
        .delete({
          where: { email },
        })
        .catch(() => {}); // Silent cleanup if it fails

      console.error("Email sending failed:", emailError);
      throw new EmailServiceError("Failed to send verification email");
    }

    return token;
  } catch (error) {
    if (error instanceof EmailServiceError) {
      throw error;
    }
    // Handle database errors
    console.error("OTP creation failed:", error);
    throw new OTPServiceError("Failed to create verification code");
  }
};

//Verify OTP
export const verifyOTP = async (
  email: string,
  otp: string
): Promise<VerifyOTPResult> => {
  try {
    const otpDoc = await prisma.emailVerification.findUnique({
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
      await prisma.emailVerification
        .delete({
          where: { email },
        })
        .catch(() => {}); // Silent cleanup

      return {
        valid: false,
        message: "Verification OTP expired",
      };
    }

    // ensure OTP is string
    const otpToCompare = otp.toString();
    const hashedOTP = otpDoc.otp;

    const isValid = await bcrypt.compare(otpToCompare, hashedOTP);
    if (!isValid) return { valid: false, message: "Invalid OTP" };

    //mark otp as used
    await prisma.emailVerification.update({
      where: {
        email: email,
      },
      data: { used: true },
    });

    return { valid: true, userId: otpDoc.userId! };
  } catch (error) {
    console.error("OTP verification failed:", error);
    throw new OTPServiceError("Failed to verify code");
  }
};
