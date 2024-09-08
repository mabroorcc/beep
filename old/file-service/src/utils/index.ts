import { IUserJwt } from "../types";

export const getUserFromJwtToken = (user: string | Object): IUserJwt => {
  if (typeof user === "string") throw new Error("Invalid Token!");
  return user as IUserJwt;
};
