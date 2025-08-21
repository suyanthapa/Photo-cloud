import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Create nodemailer transport
const transporter = nodemailer.createTransport({
  host: (process.env as any).SMTP_HOST,
  port: (process.env as any).SMTP_PORT,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Generic function to send emails — no token generation here
export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text: string
): Promise<any> {
  const info = await transporter.sendMail({
    from: `"photoCloud" `,
    to,
    subject,
    text,
    html,
  });

  console.log("Message sent: %s", info.messageId);
  return info;
}

//predefined templates
export function emailTemplateVerify(token: string) {
  const subject = "Verify your Email";
  const text = `Use this OTP to verify your email: ${token}`;
  const html = `<p>Dear User,</p>
    <p>Please use the following OTP to verify your email address:</p>
    <p><b style="font-size: 20px;">${token}</b></p>
    <p>Do not share this OTP with anyone.</p>`;
  return { subject, text, html };
}

export function emailTemplateForgotPassword(token: string) {
  const subject = "Password Recovery - Verify Your Email";
  const text = `Use this OTP to reset your password: ${token}`;
  const html = `<p>Dear User,</p>
    <p>Please use the following OTP to reset your password:</p>
    <p><b style="font-size: 20px;">${token}</b></p>
    <p>Do not share this OTP with anyone.</p>`;
  return { subject, text, html };
}

// 📩 Specific email sending function for verify email while registering
// export const verifyUserEmail = async (userEmail: string) => {
//   const token = generateToken(); // generate here only once
//   const subject = "Password Recovery - Verify Your Email";
//   const text = `Hello, use the token to verify your email: ${token}`;
//   const html = `<p>Dear User,</p>
//     <p>Please use the following token to verify your email address:</p>
//     <p><b style="font-size: 20px;">${token}</b></p>
//     <p>Do not share this token with anyone.</p>
//     <p>Thank you,<br />The photoCloud Team</p>`;

//   const info = await sendEmail(userEmail, subject, html, text);
//   console.log("token by function", token);
//   return { token, info }; // return the SAME token
// };

// export const forgotPasswordEmail = async (userEmail: string) => {
//   const token = generateToken(); // generate here only once
//   const subject = "Password Recovery - Verify Your Email";
//   const text = `Hello, use the token to verify your email: ${token}`;
//   const html = `<p>Dear User,</p>
//     <p>Please use the following token to verify your email address:</p>
//     <p><b style="font-size: 20px;">${token}</b></p>
//     <p>Do not share this token with anyone.</p>
//     <p>Thank you,<br />The photoCloud Team</p>`;

//   const info = await sendEmail(userEmail, subject, html, text);
//   console.log("token by function", token);
//   return { token, info }; // return the SAME token
// };
