import { PrismaClient } from "@prisma/client";

import bcrypt from "bcrypt";
import {
  emailTemplateForgotPassword,
  emailTemplateVerify,
  sendEmail,
} from "./mailer";

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
) {
  const token = generateToken();
  const hashedToken = await bcrypt.hash(token, 10);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); //10minutes

  //save OTP in Database
  await prisma.emailVerification.create({
    data: {
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

  await sendEmail(email, template.subject, template.html, template.text); // send otp email

  return token;
};

//Verify OTP
export const verifyOTP = async (
  email: string,
  otp: string
): Promise<VerifyOTPResult> => {
  const otpDoc = await prisma.emailVerification.findFirst({
    where: { email, used: false },
    orderBy: { createdAt: "desc" },
  });

  if (!otpDoc || !otpDoc.otp) {
    return { valid: false, message: "OTP not found" };
  }

  // ensure OTP is string
  const otpToCompare = otp.toString();
  const hash = otpDoc.otp;

  const isValid = await bcrypt.compare(otpToCompare, hash);
  if (!isValid) return { valid: false, message: "Invalid OTP" };

  if (otpDoc.expiresAt < new Date()) {
    return {
      valid: false,
      message: "OTP expired",
    };
  }

  //mark otp as used
  await prisma.emailVerification.update({
    where: {
      id: otpDoc.id,
    },
    data: { used: true },
  });

  // delete all previous OTPs
  await prisma.emailVerification.deleteMany({ where: { email, used: false } });

  return { valid: true, userId: otpDoc.userId! };
};
