import { NextFunction, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import IRequest from "./IRequest";

dotenv.config();

const getUserfromAuthToken = async (
  req: IRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
   
    //  let token = req.headers['authorization']?.replace('Bearer ', '');
    let token = req.cookies.uid;
     
      console.log("token", token)

    // if (!token) {
    //     const  authHeader = req.headers["authorization"];
    //    token = authHeader?.replace("Bearer ", "");
    // //   token = req.headers['authorization']?.replace('Bearer ', '');
        
    // }

    if (!token) {
      res.status(401).json({ message: "No token provided" });
      return;
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET as string);

    if (typeof decode === "string") {
      res.status(403).json({ message: "You are not authorized" });
      return;
    }

    req.userId = (decode as JwtPayload).userId;
    next();
  } catch (e) {
    console.error("Auth error:", e);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default getUserfromAuthToken;