import { Prisma } from "@prisma/client";

interface PrismaErrorResponse {
  statusCode: number;
  message: string;
}

export const prismaErrorHandler = (
  error: Prisma.PrismaClientKnownRequestError
): PrismaErrorResponse => {
  switch (error.code) {
    case "P2002":
      return {
        statusCode: 409,
        message: "Duplicate entry: The rcecord already exists",
      };

    case "P2003":
      return {
        statusCode: 400,
        message: "Invalid reference: related record not found.",
      };

    case "P2025":
      return {
        statusCode: 404,
        message: "Requested record not found.",
      };

    default:
      return {
        statusCode: 400,
        message: "Database request failed.",
      };
  }
};
