import { Request } from "express";

interface IRequest extends Request {
  userId?: string;
  username?: string;
}

export default IRequest;
