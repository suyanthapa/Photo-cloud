// utils/userHelpers.ts
import { PrismaClient } from "@prisma/client";
const client = new PrismaClient();

export const findUserByEmail = async (email: string) => {
  return client.user.findUnique({
    where: { email },
  });
};
