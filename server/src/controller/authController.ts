import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { error } from "console";

import { findUserByEmail } from "../utils/userHelper";
import { createAndSendOTP, verifyOTP } from "../services/otpService";
import { createUser, markUserVerified } from "../services/userService";
const client = new PrismaClient();
dotenv.config(); // Load .env varia

//regiser
const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, username, password } = req.body;

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      res.status(400).json({ error: "User already exists" });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 = salt rounds
    console.log("Hashed pw is", hashedPassword);
    //  Create new user
    const user = await client.user.create({
      data: { email, username, password: hashedPassword },
    });

    //send  verify otp
    await createAndSendOTP(email, "verify", user.id);

    res.status(200).json({
      user,
      message: "User Created and Mail sent successfully",
    });
  } catch (e: unknown) {
    console.error("Register error:", e);
    if (e instanceof Error) {
      res.status(500).json({ message: e.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

//login
const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const existingUser = await findUserByEmail(email);
    if (!existingUser) {
      res.status(400).json({ error: "User doesnot exist" });
      return;
    }

    // Compare password with hashed password
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid Login Credentials" });
      return;
    }

    if (existingUser.isEmailVerified === false) {
      //send  verify otp
      await createAndSendOTP(email, "verify", existingUser.id);
      res.status(403).json({
        message: "Email not verified. Verification OTP sent to your email.",
      });
      return;
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
    });

    res.status(200).json({
      token: token,
      message: "User Logged In ",
    });
  } catch (e: unknown) {
    console.error("Login error:", e);
    if (e instanceof Error) {
      res.status(500).json({ message: e.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

//verify email from  OTP
const verifyInputOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;

    const result = await verifyOTP(email, otp);

    if (!result.valid) {
      res.status(400).json({ message: result.message });
      return;
    }

    // Mark user as verified
    const user = await findUserByEmail(email);
    if (!user) {
      res.status(400).json({ error: "User doesnot exist" });
      return;
    }
    if (user.isEmailVerified === false) {
      await markUserVerified(email);
    }

    await client.emailVerification.deleteMany({
      where: { email },
    });
    res.status(200).json({
      message: "OTP verified successfully",
    });
    return;
  } catch (error) {
    console.error("Verify Email Error:", error);
    res.status(500).json({ message: "Server error" });
    return;
  }
};

//for forgot password otp verification
const verifyForgotPasswordOtp = verifyInputOTP;

const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    const user = await findUserByEmail(email);
    if (!user) {
      res.status(400).json({ error: "User doesnot exist" });
      return;
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

    res.status(200).json({
      details: [
        {
          message: "Otp Sent Successfully",
          user,
        },
      ],
    });
    return;
  } catch (e: unknown) {
    console.error("Send OTP error:", e);
    if (e instanceof Error) {
      res.status(500).json({ message: e.message });
      return;
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
      return;
    }
  }
};

// Reset Password ( changepassword )
const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, confirmPassword } = req.body;

    const existingUser = await findUserByEmail(email);
    if (!existingUser) {
      res.status(400).json({ error: "User doesnot exist" });
      return;
    }

    if (password != confirmPassword) {
      res.status(401).json({ message: "Password don't match" });
      return;
    }

    //  Hash password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 = salt rounds

    await client.user.update({
      where: { id: existingUser.id },
      data: {
        password: hashedPassword,
      },
    });

    res.status(200).json({ message: "Password reset successfully" });
  } catch (e: unknown) {
    console.error("Login error:", e);
    if (e instanceof Error) {
      res.status(500).json({ message: e.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

const authController = {
  register,
  login,
  verifyInputOTP,

  forgotPassword,
  verifyForgotPasswordOtp,
  resetPassword,
};

export default authController;
