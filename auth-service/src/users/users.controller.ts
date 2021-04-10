import { Router } from "express";
import * as Responder from "../responder";
import * as userService from "./users.service";
import { StatusCodes } from "http-status-codes";
import authMiddleWare from "../middlewares/auth.middleware";


const userRouter = Router();


//
userRouter.get("/check/username/:username", async (req, res) => {
  try {
    const userName = req.params.username;
    if (!userName) {
      return Responder.respondeWithError(res, 404, "Provide userName!");
    }

    const user = await userService.findOneUser({ userName });

    if (user && user.userName === userName) {
      return Responder.respondWithSuccess(
        res,
        StatusCodes.OK,
        "Already taken!"
      );
    }

    Responder.respondWithSuccess(res, 200, "Available!");
  } catch (e) {
    Responder.respondeWithError(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      e.message,
      e
    );
  }
});



//
userRouter.post("/change/picture", authMiddleWare, async (req, res) => {
  try {
    const picture = req.body.picture;
    if (!picture) {
      Responder.respondeWithError(
        res,
        StatusCodes.BAD_REQUEST,
        "picture url not found!"
      );
    }
    const result = await userService.changeProfile(picture, req.user.userName);
    Responder.respondWithSuccess(
      res,
      StatusCodes.OK,
      "Picture changed successfully!",
      result
    );
  } catch (e) {
    Responder.respondeWithError(res, StatusCodes.BAD_REQUEST, e.message, e);
  }
});



//
userRouter.post("/change/username", authMiddleWare, async (req, res) => {
  try {
    const userName = req.body.userName;
    if (!userName) {
      Responder.respondeWithError(
        res,
        StatusCodes.BAD_REQUEST,
        "userName not found!"
      );
    }

    const result = await userService.changeUserName(req.user.id, userName);
    Responder.respondWithSuccess(
      res,
      StatusCodes.OK,
      "userName changed successfully!",
      result
    );
  } catch (e) {
    Responder.respondeWithError(res, StatusCodes.BAD_REQUEST, e.message, e);
  }
});



// 
userRouter.delete("/delete/account", authMiddleWare, async (req, res) => {
  const email = req.body.email;
  if (!email) {
    return Responder.respondeWithError(
      res,
      StatusCodes.UNAUTHORIZED,
      "Email not defined!"
    );
  }
  try {
    await userService.deleteUser(email);
    Responder.respondWithSuccess(res, 200, "We won't let you go.'");
  } catch (e) {
    Responder.respondeWithError(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Something terrible happened!"
    );
  }
});


export default userRouter;
