import Mailgun from "mailgun.js";
import formData from "form-data";
import dotenv from "dotenv";

dotenv.config();

// Validate required Mailgun environment variables
if (!process.env.MAILGUN_API_KEY) {
  throw new Error("MAILGUN_API_KEY is required in environment variables");
}

if (!process.env.MAILGUN_DOMAIN) {
  throw new Error("MAILGUN_DOMAIN is required in environment variables");
}

// Initialize Mailgun client
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY as string,
});

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text: string
): Promise<any> {
  console.log("🔍 Attempting to send email with Mailgun SDK...");
  console.log("📧 To:", to);
  console.log("🌐 Domain:", process.env.MAILGUN_DOMAIN);

  try {
    const messageData = {
      from: `PhotoCloud <noreply@${process.env.MAILGUN_DOMAIN}>`,
      to: [to],
      subject,
      text,
      html,
    };

    const response = await mg.messages.create(
      process.env.MAILGUN_DOMAIN as string,
      messageData
    );

    console.log("✅ Email sent successfully via Mailgun SDK");
    console.log("📤 Message ID:", response.id);
    return response;
  } catch (error: any) {
    console.error("❌ Mailgun API error:", error);
    if (error.details) {
      console.error("📋 Error details:", error.details);
    }
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

// Professional email templates with enhanced styling
export function emailTemplateVerify(token: string) {
  const subject = "Verify Your PhotoCloud Account";
  const text = `Welcome to PhotoCloud! Use this OTP to verify your email: ${token}. This code expires in 10 minutes. Do not share this code with anyone.`;
  const html = `
    <div style="max-width: 600px; margin: 0 auto; font-family: 'Arial', sans-serif; background-color: #f8fafc; padding: 20px;">
      <div style="background-color: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin: 0; font-size: 28px;">📸 PhotoCloud</h1>
          <p style="color: #64748b; margin: 10px 0 0 0;">Your Photo Storage Solution</p>
        </div>
        
        <h2 style="color: #1e293b; margin-bottom: 20px; text-align: center;">Welcome to PhotoCloud!</h2>
        
        <p style="color: #475569; line-height: 1.6; margin-bottom: 25px; text-align: center;">
          Thank you for joining PhotoCloud. Please use the verification code below to complete your account setup:
        </p>
        
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px; padding: 25px; text-align: center; margin: 30px 0;">
          <p style="color: white; margin: 0; font-size: 14px; opacity: 0.9;">Your Verification Code</p>
          <h1 style="color: white; font-size: 36px; font-weight: bold; margin: 10px 0; letter-spacing: 5px; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">${token}</h1>
        </div>
        
        <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 25px 0; border-radius: 0 8px 8px 0;">
          <p style="color: #92400e; margin: 0; font-size: 14px;">
            <strong>⏱️ Important:</strong> This code expires in 10 minutes for your security.
          </p>
        </div>
        
        <p style="color: #64748b; text-align: center; margin: 25px 0; font-size: 14px;">
          If you didn't create this account, please ignore this email.
        </p>
        
        <div style="border-top: 1px solid #e2e8f0; padding-top: 25px; margin-top: 30px; text-align: center;">
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">
            © 2025 PhotoCloud. All rights reserved.<br>
            This is an automated message, please do not reply.
          </p>
        </div>
      </div>
    </div>`;
  return { subject, text, html };
}

export function emailTemplateForgotPassword(token: string) {
  const subject = "Reset Your PhotoCloud Password";
  const text = `Password reset requested for your PhotoCloud account. Use this OTP: ${token}. This code expires in 10 minutes. If you didn't request this, please ignore this email.`;
  const html = `
    <div style="max-width: 600px; margin: 0 auto; font-family: 'Arial', sans-serif; background-color: #f8fafc; padding: 20px;">
      <div style="background-color: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin: 0; font-size: 28px;">📸 PhotoCloud</h1>
          <p style="color: #64748b; margin: 10px 0 0 0;">Password Recovery</p>
        </div>
        
        <h2 style="color: #1e293b; margin-bottom: 20px; text-align: center;">🔒 Password Reset Request</h2>
        
        <p style="color: #475569; line-height: 1.6; margin-bottom: 25px; text-align: center;">
          We received a request to reset your PhotoCloud account password. Use the code below to proceed:
        </p>
        
        <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 10px; padding: 25px; text-align: center; margin: 30px 0;">
          <p style="color: white; margin: 0; font-size: 14px; opacity: 0.9;">Password Reset Code</p>
          <h1 style="color: white; font-size: 36px; font-weight: bold; margin: 10px 0; letter-spacing: 5px; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">${token}</h1>
        </div>
        
        <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 25px 0; border-radius: 0 8px 8px 0;">
          <p style="color: #b91c1c; margin: 0; font-size: 14px;">
            <strong>⚠️ Security Alert:</strong> This code expires in 10 minutes. Never share this code with anyone.
          </p>
        </div>
        
        <p style="color: #64748b; text-align: center; margin: 25px 0; font-size: 14px;">
          If you didn't request this password reset, please ignore this email and your password will remain unchanged.
        </p>
        
        <div style="border-top: 1px solid #e2e8f0; padding-top: 25px; margin-top: 30px; text-align: center;">
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">
            © 2025 PhotoCloud. All rights reserved.<br>
            This is an automated message, please do not reply.
          </p>
        </div>
      </div>
    </div>`;
  return { subject, text, html };
}

// Professional Email Service Class
export class EmailService {
  static async sendVerificationEmail(to: string, otp: string): Promise<void> {
    const template = emailTemplateVerify(otp);
    await sendEmail(to, template.subject, template.html, template.text);
  }

  static async sendPasswordResetEmail(to: string, otp: string): Promise<void> {
    const template = emailTemplateForgotPassword(otp);
    await sendEmail(to, template.subject, template.html, template.text);
  }
}
