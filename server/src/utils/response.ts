import { Response } from "express";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message: string;
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message: string,
  statusCode: number = 200
): void => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
  };

  res.status(statusCode).json(response);
};
