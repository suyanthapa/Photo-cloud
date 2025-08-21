import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const client = new PrismaClient();

export const createUser = async (
  email: string,
  username: string,
  password: string
) => {
  const hashedPassword = await bcrypt.hash(password, 10); //hash the password
  return client.user.create({
    data: {
      username: username,
      password: hashedPassword,
      email: email,
      isEmailVerified: false,
    },
  });
};

export const findUserByEmail = async (email: string) => {
  return client.user.findUnique({
    where: {
      email: email,
    },
  });
};

export const markUserVerified = async (email: string) => {
  return client.user.update({
    where: { email },
    data: {
      isEmailVerified: true,
    },
  });
};
