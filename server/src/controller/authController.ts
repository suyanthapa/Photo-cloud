import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { error } from "console";
import { verifyUserEmail } from "../services/mailer";
import { findUserByEmail } from "../utils/userHelper";
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

    // 2️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 = salt rounds

    // 3️⃣ Create new user
    const user = await client.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      user,
      message: "New user created successfully",
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

    res.status(201).json({
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
const verifyRegisterOtp = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, username, password, OTP } = req.body;

    //  Get OTP record from EmailVerification table
    const otpDoc = await client.emailVerification.findFirst({
      where: { email, used: false },
      orderBy: { createdAt: "desc" }, // get latest
    });

    if (!otpDoc) {
      res.status(400).json({ message: "OTP not found or already used" });
      return;
    }

    // Check if OTP expired
    if (otpDoc.expiresAt < new Date()) {
      res.status(400).json({ message: "OTP expired" });
      return;
    }

    //  Compare OTP
    if (otpDoc.otp != OTP) {
      res.status(400).json({ message: "Invalid OTP" });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 = salt rounds

    // 3️⃣ Create new user
    const user = await client.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });
    //  Mark OTP as used
    await client.emailVerification.update({
      where: { id: otpDoc.id },
      data: {
        used: true,
      },
    });

    // 7️⃣ Generate token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "OTP verified successfully",
      user: { ...user, isEmailVerified: true },
      token,
    });
    return;
  } catch (error) {
    console.error("Verify Email Error:", error);
    res.status(500).json({ message: "Server error" });
    return;
  }
};

// Send OTP for user registration
const sendRegisterOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    const user = await findUserByEmail(email);
    if (user) {
      res.status(400).json({ error: "User already exists" });
      return;
    }

    // 2 Check if OTP already exists for this email & delete it
    const existingOTP = await client.emailVerification.findFirst({
      where: { email, used: false },
    });

    if (existingOTP) {
      await client.emailVerification.deleteMany({
        where: { email },
      });
    }
    // Call the function to send the verify email
    const { token, info } = await verifyUserEmail(email);

    const expiryOTP = new Date(Date.now() + 10 * 60 * 1000); // valid for 10 minutes

    await client.emailVerification.create({
      data: {
        email,
        otp: token, // plain
        expiresAt: expiryOTP,
        used: false,
        userId: null,
      },
    });

    const otpDoc = await client.emailVerification.findFirst({
      where: { email, used: false },
      orderBy: { createdAt: "desc" },
    });

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

const authController = {
  register,
  login,
  verifyRegisterOtp,
  sendRegisterOtp,
};

export default authController;
