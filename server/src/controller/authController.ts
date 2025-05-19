import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const client = new PrismaClient();

//regiser
const register = async (req: Request, res: Response):Promise<void> => {
  try {
    const { email, username, password } = req.body;
    const existingusers = await client.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingusers) {
      res.status(400).json({ error: "User already exists" });
      return;
    }

   const user= await client.user.create({
      data: {
        email: email,
        username: username,
        password: password,
      },
    });
    console.log("User Created Successfulyy");
    res.status(201).json({ 
        user,
        message: "User created successfully" 
    });
    return
  } catch (e: unknown) {
    console.error("Register error:", e);
    if (e instanceof Error) {
       res.status(500).json({ message: e.message });
    } else {
       res.status(500).json({ message: "An unknown error occurred" });
    }
  }
};

const authController = {
  register,
};

export default authController;
