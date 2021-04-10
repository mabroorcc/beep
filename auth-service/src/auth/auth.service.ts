import { validate } from "class-validator";
import { ServerException } from "../exceptions";
import { CreateUserDto } from "../users/dto/createUser.dto";
import * as userService from "../users/users.service";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../credentials";
import { v4 } from "uuid";

export const getTokenByLogin = async (payload: any): Promise<string> => {
  // Validation
  const userDto = new CreateUserDto();
  userDto.name = payload.name;
  userDto.email = payload.email;
  userDto.picture = payload.picture;

  console.log(userDto);

  const valid = await validate(userDto);
  if (valid.length) throw new ServerException(valid);

  // Checking if user already exists
  const savedUser = await findIfUserExists(userDto);
  if (savedUser) return createToken({ ...savedUser, jwtId: v4() });

  // Creating new user
  const user = await userService.createUser(userDto);

  return createToken({ ...user, jwtId: v4() });
};

const createToken = (payload: any): string => {
  return jwt.sign(payload, JWT_SECRET);
};

const findIfUserExists = async (user: any) => {
  return await userService.findOneUser(user);
};
