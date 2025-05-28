import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import dotenv from 'dotenv';
import jwt  from "jsonwebtoken";

const client = new PrismaClient();
dotenv.config(); // Load .env varia

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
    //create new user
   const user= await client.user.create({
      data: {
        email: email,
        username: username,
        password: password,
      },
    });
  
    res.status(201).json({ 
        user,
        message: "New User created successfully" 
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


//login
const login = async ( req: Request, res: Response): Promise<void> =>{
  const { email , password} = req.body;

  //check user exists or not
  const exisitingUser = await client.user.findFirst({
    where:{
      email: email,
      password: password
    }
  });

  if (!exisitingUser){
    res.status(200).json({
      message: "Invalid Login Credentials"
    })
    return
  }

  //generate token
  const token = jwt.sign(
    {
    userId : exisitingUser.id
    },
   process.env.JWT_SECRET as string,
    {expiresIn: '7d'}
);

    console.log("The token is ", token)

    res.cookie('uid',token,{
      httpOnly: true,
      secure: true
    })

          
  
    res.status(201).json({
      token,
     
      message : "User Logged In "
    })

}


const authController = {
  register,
  login
};

export default authController;
