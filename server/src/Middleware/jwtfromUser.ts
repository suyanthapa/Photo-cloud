import { NextFunction, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import IRequest from "./IRequest";
import { PrismaClient } from "@prisma/client";
const client = new PrismaClient();
dotenv.config();

const getUserfromAuthToken = async (
  req: IRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token = req.cookies.uid;

    console.log("token", token);

    if (!token) {
      res.status(401).json({ message: "No token provided" });
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    if (!decoded || typeof decoded === "string") {
      res.status(403).json({ message: "You are not authorized" });
      return;
    }

    req.userId = decoded.userId;
    req.username = decoded.username;
    next();
  } catch (e) {
    console.error("Auth error:", e);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default getUserfromAuthToken;

// Shared function that both HTTP and Socket.IO can use
export const verifyAndGetUser = async (token: string) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

  const user = await client.user.findUnique({
    where: { id: decoded.userId },
    select: { id: true, username: true, email: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};
