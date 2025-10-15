import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { findUserByEmail } from "../utils/userHelper";
import { createAndSendOTP, verifyOTP } from "../services/otpService";
import { createUser, markUserVerified } from "../services/userService";
import IRequest from "../Middleware/IRequest";
import { asyncHandler } from "../utils/asyncHandler";
import {
  AppError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "../utils/errors";
import { sendSuccess } from "../utils/response";
import { send } from "process";
const client = new PrismaClient();
dotenv.config(); // Load .env variables

//regiser
const register = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email, username, password } = req.body;

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      throw new ConflictError("User already exists");
    }

    const uniqueUsername = await client.user.findUnique({
      where: { username },
    });
    if (uniqueUsername) {
      throw new ConflictError("Username already taken");
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 = salt rounds
    console.log("Hashed pw is", hashedPassword);
    //  Create new user
    const user = await client.user.create({
      data: { email, username, password: hashedPassword },
    });
    console.log("Email is", email);
    console.log("ID:", user.id);

    //send  verify otp
    await createAndSendOTP(email, "verify", user.id);

    sendSuccess(
      res,
      {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
      },
      "User Created and Mail sent successfully",
      201
    );
  }
);

//login
const login = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    const existingUser = await findUserByEmail(email);
    if (!existingUser) {
      throw new NotFoundError("User");
    }

    // Compare password with hashed password
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid Login Credentials");
    }

    if (existingUser.isEmailVerified === false) {
      //send  verify otp
      await createAndSendOTP(email, "verify", existingUser.id);
      throw new AppError("Please verify your email. OTP sent again.", 400);
    }

    //generate token
    const token = jwt.sign(
      {
        userId: existingUser.id,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    console.log("The token is ", token);

    res.cookie("uid", token, {
      httpOnly: true,
      secure: true, // true on https only
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    sendSuccess(
      res,
      {
        token,
        user: {
          id: existingUser.id,
          username: existingUser.username,
          email: existingUser.email,
        },
      },
      "Logged in successfully",
      200
    );
  }
);

//verify email from  OTP
const verifyInputOTP = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email, otp } = req.body;

    const result = await verifyOTP(email, otp);

    if (!result.valid) {
      throw new ValidationError(result.message || "Invalid verification code");
    }

    // Mark user as verified
    const user = await findUserByEmail(email);
    if (!user) {
      throw new NotFoundError("User");
    }
    if (user.isEmailVerified === false) {
      await markUserVerified(email);
    }

    await client.emailVerification.deleteMany({
      where: { email },
    });
    sendSuccess(res, null, "Email verified successfully");
  }
);

//for forgot password otp verification
const verifyForgotPasswordOtp = verifyInputOTP;

const forgotPassword = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    const user = await findUserByEmail(email);
    if (!user) {
      throw new NotFoundError("User");
    }

    // check if OTP already exists for this email & delete it
    const existingOTP = await client.emailVerification.findFirst({
      where: { email, used: false },
    });

    if (existingOTP) {
      await client.emailVerification.deleteMany({
        where: { email },
      });
    }
    //create and send otp
    await createAndSendOTP(email, "forgot", user.id);

    sendSuccess(res, null, "Otp Sent Successfully");
  }
);

// Reset Password ( changepassword )
const resetPassword = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password, confirmPassword } = req.body;

    const existingUser = await findUserByEmail(email);
    if (!existingUser) {
      throw new NotFoundError("User");
    }

    if (password != confirmPassword) {
      throw new ValidationError("Password don't match");
    }

    //  Hash password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 = salt rounds

    await client.user.update({
      where: { id: existingUser.id },
      data: {
        password: hashedPassword,
      },
    });

    sendSuccess(res, null, "Password reset successfully");
  }
);

//logout
const logout = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    res.clearCookie("uid", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    sendSuccess(res, null, "Logged out successfully");
  }
);

const updatePassword = asyncHandler(
  async (req: IRequest, res: Response): Promise<void> => {
    const userId = Number(req.userId);

    const { currentPassword, newPassword, confirmPassword } = req.body;
    if (!userId) {
      throw new UnauthorizedError("Unauthorized: User ID missing");
    }
    const user = await client.user.findUnique({
      where: { id: Number(userId) },
    });
    if (!user) {
      throw new NotFoundError("User");
    }
    // Compare current password with hashed password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid current password");
    }

    if (newPassword != confirmPassword) {
      throw new ValidationError("Password don't match");
    }

    //  Hash password
    const hashedPassword = await bcrypt.hash(newPassword, 10); // 10 = salt rounds

    await client.user.update({
      where: { id: Number(userId) },
      data: {
        password: hashedPassword,
      },
    });

    sendSuccess(res, null, "Password updated successfully");
  }
);

const me = asyncHandler(async (req: IRequest, res: Response): Promise<void> => {
  const userId = Number(req.userId);

  if (!userId) {
    throw new UnauthorizedError("Unauthorized: User ID missing");
  }
  const user = await client.user.findUnique({
    where: { id: Number(userId) },
  });
  if (!user) {
    throw new NotFoundError("User");
  }

  //extracct name , email, isEmailVerified
  const { id, username, email, isEmailVerified, createdAt } = user;

  sendSuccess(
    res,
    { id, username, email, isEmailVerified, createdAt },
    "Profile shown successfully"
  );
});

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

export default authController;
