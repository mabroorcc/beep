import { validate } from "class-validator";
import { ServerException } from "../exceptions";
import { CreateUserDto } from "../users/dto/createUser.dto";
import * as userService from "../users/users.service";
import jwt from "jsonwebtoken";
import { v4 } from "uuid";
import * as jwtCache from "../cache/jwtId.cache";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET not found");

export const getTokenByLogin = async (
  payload: any
): Promise<{ token: string; newuser: boolean }> => {
  // Validation
  const userDto = new CreateUserDto();

  userDto.name = payload.name;
  userDto.email = payload.email;
  userDto.picture = payload.picture;

  const valid = await validate(userDto);
  if (valid.length) throw new ServerException(valid);

  const key = v4();

  // Checking if user already exists
  const userExists = await findIfUserExists(userDto);

  if (userExists) {
    // Storing the key in redis cache
    await jwtCache.storeJwtIdInCache(key, userExists.id);
    return { token: createToken(key), newuser: false };
  }

  // Creating new user
  const user = await userService.createUser(userDto);
  // Storing the key in redis
  await jwtCache.storeJwtIdInCache(key, user.id);

  return { token: createToken(key), newuser: true };
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

const findIfUserExists = async (user: CreateUserDto) => {
  return await userService.findOneUser({ email: user.email });
};
