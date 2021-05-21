import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import * as Responder from "../responder";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../credentials";
import { checkJwtIdInCache } from "../cache/jwtId.cache";
import { getUserById } from "../users/users.service";

export interface IUserJwt {
  id: string;
  name: string;
  userName: string;
  email: string;
  picture: string;
  createdAt: string;
  updatedAt: string;
  jwtId: string;
}

export interface IUserRequest extends Request {
  user: IUserJwt;
}

const authMiddleWare = async (
  req: IUserRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.auth;

  if (!token) {
    return Responder.Error(res, StatusCodes.OK, "Please login first!");
  }

  try {
    const key = jwt.verify(token, JWT_SECRET);

    if (typeof key !== "string") return next("Please login!");

    const uid = await checkJwtIdInCache(key);

    if (!uid) return next("Please login again");

    const user = await getUserById(uid);

    if (!user) return next("Please login again");

    req.user = { ...user, jwtId: key };

    next();
  } catch (e) {
    console.log("error", e);
    Responder.Error(res, StatusCodes.BAD_REQUEST, "Please login first!");
  }
};

export default authMiddleWare;
