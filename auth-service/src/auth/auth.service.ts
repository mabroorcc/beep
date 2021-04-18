import { validate } from "class-validator";
import { ServerException } from "../exceptions";
import { CreateUserDto } from "../users/dto/createUser.dto";
import * as userService from "../users/users.service";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../credentials";
import { v4 } from "uuid";
import * as jwtCache from "../cache/jwtId.cache";

export const getTokenByLogin = async (payload: any): Promise<string> => {
  // Validation
  const userDto = new CreateUserDto();

  userDto.name = payload.name;
  userDto.email = payload.email;
  userDto.picture = payload.picture;

  const valid = await validate(userDto);
  if (valid.length) throw new ServerException(valid);

  const jwtId = v4();

  // Checking if user already exists
  const userExists = await findIfUserExists(userDto);

  if (userExists) {
    const token = createToken({ ...userExists, jwtId });

    // Storing the key in redis cache
    const result = await jwtCache.storeJwtIdInCache(jwtId, "true");
    console.log("Stored jwt:" + result);
    return token;
  }

  // Creating new user
  const user = await userService.createUser(userDto);
  const token = createToken({ ...user, jwtId });
  // Storing the key in redis
  const result = await jwtCache.storeJwtIdInCache(jwtId, "true");
  console.log("Stored jwt:" + result);
  return token;
};

export const verifyToken = async (jwtId: string) => {
  return jwtCache.checkJwtIdInCache(jwtId);
};

export const deleteToken = async (jwtId: string) => {
  return jwtCache.deleteJwtFromCache(jwtId);
};

//
// Convi
//
const createToken = (payload: any): string => {
  return jwt.sign(payload, JWT_SECRET);
};

const findIfUserExists = async (user: any) => {
  return await userService.findOneUser(user);
};
