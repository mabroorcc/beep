import { Router } from "express";
import * as Responder from "../responder";
import * as userService from "./users.service";
import { StatusCodes } from "http-status-codes";
import authMiddleWare from "../middlewares/auth.middleware";
import { FindUserByEmailDto } from "./dto/user.dto";
import { validate } from "class-validator";

const userRouter = Router();

//
userRouter.get("/check/username/:username", async (req, res) => {
  try {
    const userName = req.params.username;
    if (!userName) {
      return Responder.Error(res, 404, "Provide userName!");
    }

    const user = await userService.findOneUser({ userName });

    if (user && user.userName === userName) {
      return Responder.Success(res, StatusCodes.UNAUTHORIZED, "Already taken!");
    }

    Responder.Success(res, 200, "Available!");
  } catch (e) {
    Responder.Error(res, StatusCodes.INTERNAL_SERVER_ERROR, e.message, e);
  }
});

//
userRouter.post("/change/picture", authMiddleWare, async (req, res) => {
  try {
    const picture = req.body.picture;
    if (!picture) {
      Responder.Error(res, StatusCodes.BAD_REQUEST, "picture url not found!");
    }
    const result = await userService.changeProfile(picture, req.user.userName);
    Responder.Success(
      res,
      StatusCodes.OK,
      "Picture changed successfully!",
      result
    );
  } catch (e) {
    console.log(e);
    Responder.Error(res, StatusCodes.BAD_REQUEST, e.message, e);
  }
});

//
userRouter.post("/change/username", authMiddleWare, async (req, res) => {
  try {
    const userName = req.body.userName;
    if (!userName) {
      return Responder.Error(
        res,
        StatusCodes.BAD_REQUEST,
        "userName not found!"
      );
    }

    const result = await userService.changeUserName(req.user.id, userName);
    res.cookie("auth", "");
    return Responder.Success(
      res,
      StatusCodes.OK,
      "userName changed successfully!",
      result
    );
  } catch (e) {
    Responder.Error(res, StatusCodes.BAD_REQUEST, e.message, e);
  }
});

//
userRouter.delete("/delete/account", authMiddleWare, async (req, res) => {
  const email = req.body.email;
  if (!email) {
    return Responder.Error(res, StatusCodes.UNAUTHORIZED, "Email not defined!");
  }
  try {
    await userService.deleteUser(email);
    Responder.Success(res, 200, "We won't let you go.'");
  } catch (e) {
    Responder.Error(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Something terrible happened!"
    );
  }
});

userRouter.get("/find/email/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const isValid = await validateEmail(email);

    if (!isValid) {
      return Responder.Error(
        res,
        StatusCodes.UNAUTHORIZED,
        "Please provide a valid email!"
      );
    }

    const user = await userService.getUserByEmail(email);

    if (!user) {
      return Responder.Error(res, StatusCodes.NOT_FOUND, "User not found!");
    }

    return Responder.Success(res, 200, "User found!", { user });
  } catch (e) {
    console.log(e);
    Responder.Error(res, StatusCodes.INTERNAL_SERVER_ERROR, e.message, e);
  }
});

userRouter.get("/find/username/:username", async (req, res) => {
  try {
    const username = req.params.username;

    // validating the username
    if (!username) {
      return Responder.Error(
        res,
        StatusCodes.BAD_REQUEST,
        "Please provide a valid username!"
      );
    }

    const users = await userService.getUsersByUserName(username);

    return Responder.Success(res, 200, "User found!", { users });
  } catch (e) {
    console.log(e);
    Responder.Error(res, StatusCodes.INTERNAL_SERVER_ERROR, e.message, e);
  }
});

const validateEmail = async (email: string): Promise<boolean> => {
  if (!email) {
    return false;
  }

  // create a dto
  const findByEmailDto = new FindUserByEmailDto(email);

  // verify
  const valid = await validate(findByEmailDto);

  if (valid.length > 0) {
    return false;
  }

  return true;
};

export default userRouter;
