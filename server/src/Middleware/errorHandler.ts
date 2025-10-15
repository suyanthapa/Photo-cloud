import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";
import { Prisma } from "@prisma/client";
import { prismaErrorHandler } from "../utils/prismaErrorHandler";
import { parseStack } from "../utils/stackParser";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = "Internal Server Error";
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Handle known Prisma errors
    const prismaHandled = prismaErrorHandler(error);
    statusCode = prismaHandled.statusCode;
    message = prismaHandled.message;
  }
  console.error(`[${new Date().toString()}] Error:`, {
    message: error.message,
    url: req.url,
    method: req.method,
  });
  //  API response
  const response =
    process.env.NODE_ENV === "development"
      ? { success: false, message, stack: parseStack(error.stack) } // dev sees details
      : { success: false, message }; // prod safe

  res.status(statusCode).json(response);
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
};
