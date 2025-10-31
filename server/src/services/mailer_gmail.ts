import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create Gmail SMTP transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text: string
): Promise<any> {
  console.log(" Attempting to send email with Gmail SMTP...");
  console.log(" To:", to);

  try {
    const mailOptions = {
      from: `"PhotoCloud" <${process.env.SMTP_USERNAME}>`,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(" Email sent successfully via Gmail");
    console.log(" Message ID:", info.messageId);
    return info;
  } catch (error: any) {
    console.error(" Gmail SMTP error:", error);
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
        
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
          <h2 style="color: white; margin: 0 0 15px 0; font-size: 24px;">Email Verification</h2>
          <p style="color: #e2e8f0; margin: 0 0 20px 0;">Your verification code is:</p>
          <div style="background-color: white; padding: 15px; border-radius: 8px; display: inline-block;">
            <span style="font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 8px;">${token}</span>
          </div>
        </div>
        
        <div style="text-align: center; margin-bottom: 30px;">
          <p style="color: #374151; margin: 0 0 15px 0; font-size: 16px;">
            Welcome to PhotoCloud! Please enter this verification code to activate your account.
          </p>
          <p style="color: #6b7280; margin: 0; font-size: 14px;">
            This code will expire in <strong>10 minutes</strong>. For security reasons, do not share this code with anyone.
          </p>
        </div>
        
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
          <p style="color: #059669; margin: 0; font-weight: 600; font-size: 14px;">🔒 Security Tips:</p>
          <ul style="color: #374151; margin: 10px 0 0 20px; font-size: 14px;">
            <li>Never share your verification code with others</li>
            <li>PhotoCloud will never ask for your password via email</li>
            <li>If you didn't request this, please ignore this email</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; margin: 0; font-size: 12px;">
            © 2024 PhotoCloud. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  `;

  return { subject, text, html };
}

export function emailTemplateForgot(token: string) {
  const subject = "Reset Your PhotoCloud Password";
  const text = `Reset your PhotoCloud password using this OTP: ${token}. This code expires in 10 minutes. If you didn't request this, please ignore this email.`;
  const html = `
    <div style="max-width: 600px; margin: 0 auto; font-family: 'Arial', sans-serif; background-color: #f8fafc; padding: 20px;">
      <div style="background-color: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin: 0; font-size: 28px;">📸 PhotoCloud</h1>
          <p style="color: #64748b; margin: 10px 0 0 0;">Your Photo Storage Solution</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
          <h2 style="color: white; margin: 0 0 15px 0; font-size: 24px;">Password Reset</h2>
          <p style="color: #fce7f3; margin: 0 0 20px 0;">Your reset code is:</p>
          <div style="background-color: white; padding: 15px; border-radius: 8px; display: inline-block;">
            <span style="font-size: 32px; font-weight: bold; color: #dc2626; letter-spacing: 8px;">${token}</span>
          </div>
        </div>
        
        <div style="text-align: center; margin-bottom: 30px;">
          <p style="color: #374151; margin: 0 0 15px 0; font-size: 16px;">
            Use this code to reset your PhotoCloud password.
          </p>
          <p style="color: #6b7280; margin: 0; font-size: 14px;">
            This code will expire in <strong>10 minutes</strong>. If you didn't request this, you can safely ignore this email.
          </p>
        </div>
        
        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b;">
          <p style="color: #92400e; margin: 0; font-weight: 600; font-size: 14px;">⚠️ Important:</p>
          <p style="color: #78350f; margin: 5px 0 0 0; font-size: 14px;">
            If you didn't request a password reset, please secure your account immediately by changing your password.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; margin: 0; font-size: 12px;">
            © 2024 PhotoCloud. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  `;

  return { subject, text, html };
}
