import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import * as Responder from "../responder";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../credentials";

export interface IUserJwt {
  id: string;
  name: string;
  userName: string;
  email: string;
  picture: string;
  createdAt: string;
  updatedAt: string;
  jwtId: string;
  iat: number;
}

export interface IUserRequest extends Request {
  user: IUserJwt;
}

const authMiddleWare = (
  req: IUserRequest,
  res: Response,
  next: NextFunction
) => {
  const auth = req.cookies.auth;

  if (!auth) {
    return Responder.Error(
      res,
      StatusCodes.UNAUTHORIZED,
      "Please login first!"
    );
  }

  try {
    const user = jwt.verify(auth, JWT_SECRET);
    req.user = user as IUserJwt;
    next();
  } catch (e) {
    Responder.Error(
      res,
      StatusCodes.BAD_REQUEST,
      "Please login first!"
    );
  }
};

export default authMiddleWare;
