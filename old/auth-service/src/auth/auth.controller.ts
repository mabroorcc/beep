import { Router } from "express";
import request from "request-promise";
import * as authService from "./auth.service";
import * as Responder from "../responder";
import {
  FIRST_LOGIN_REDIRECT,
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
} from "../credentials";
import { ServerException } from "../exceptions";
import { StatusCodes } from "http-status-codes";
import authMiddleWare from "../middlewares/auth.middleware";

const AFTER_LOGIN_REDIRECT_URI = process.env.AFTER_LOGIN_REDIRECT_URI;
const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN;
if (!AFTER_LOGIN_REDIRECT_URI)
  throw new Error("AFTER_LOGIN_REDIRECT_URI not found");
if (!COOKIE_DOMAIN) throw new Error("COOKIE_DOMAIN not found");

const authRouter = Router();

//
// User will come to this route for login
//
authRouter.get("/login/google", (_req, res) => {
  // redirecting user to google with my credentials
  res.redirect(FIRST_LOGIN_REDIRECT);
});

//
// get current logged in user
//
authRouter.get("/current/user", authMiddleWare, async (req, res) => {
  try {
    // check from cache if the user is valid
    const valid = await authService.verifyToken(req.user.jwtId);
    if (!valid) {
      // not valid then remove the cookie
      res.cookie("auth", "", { httpOnly: true });

      // then ask user to login again
      return Responder.Error(res, StatusCodes.FORBIDDEN, "Please login again!");
    }

    // every thing goes well return the user
    return Responder.Success(res, 200, "User returned", {
      user: req.user,
    });
  } catch (e) {
    console.log(e);
    Responder.Error(res, StatusCodes.INTERNAL_SERVER_ERROR, e.message);
  }
});

//
// This route will be called by google
//
authRouter.get("/login/google/callback", async (req, res) => {
  try {
    // check if we got token or not
    if (!req.query.code) throw new ServerException("User rejected login!");
    const code = req.query.code;

    // trade the code in for an access token
    let { access_token } = await tradeCodeForAccessToken(String(code));

    // use that token to get the data of the user
    const profile = await getDataUsingAccessToken(access_token);

    // genearting token with that profile
    const { token, newuser } = await authService.getTokenByLogin(profile);

    res.cookie("auth", token, {
      domain: COOKIE_DOMAIN,
      httpOnly: true,
      path: "/",
    });

    res.cookie("new", String(newuser), {
      domain: COOKIE_DOMAIN,
      path: "/",
    });

    // here user is logged in now and we should redirect him to website
    res.redirect(AFTER_LOGIN_REDIRECT_URI);
  } catch (e) {
    Responder.Error(res, StatusCodes.INTERNAL_SERVER_ERROR, e.message, e);
  }
});

//
// this route will be used by other services to check if the jwt is valid
//
authRouter.get("/verify/jwt/:jwtid", async (req, res) => {
  try {
    // checking
    const result = await authService.verifyToken(req.params.jwtid);
    if (result) {
      return Responder.Success(res, 200, "valid", {
        success: result,
      });
    } else {
      return Responder.Error(res, 200, "Invalid", {
        valid: result,
      });
    }
  } catch (e) {
    Responder.Error(res, StatusCodes.INTERNAL_SERVER_ERROR, e.message, e);
  }
});

//
//  for user signout
//
authRouter.get("/signout", authMiddleWare, (req, res) => {
  // removing the cookie
  res.cookie("auth", "", {
    domain: COOKIE_DOMAIN,
    httpOnly: true,
    path: "/",
  });

  // removing the cache
  authService.deleteToken(req.user.jwtId);

  // responding
  Responder.Success(res, 200, "Signed out!");
});

// Convi
const getDataUsingAccessToken = async (token: string) => {
  return await request({
    method: "get",
    url: "https://www.googleapis.com/oauth2/v3/userinfo",
    headers: {
      Authorization: "Bearer " + token,
    },
    json: true,
    simple: true,
  });
};

const tradeCodeForAccessToken = async (code: string) => {
  return await request({
    method: "post",
    url: "https://oauth2.googleapis.com/token",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    form: {
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: "authorization_code",
      redirect_uri: REDIRECT_URI,
      scope: ["email", "profile"],
    },
    json: true,
    simple: true,
  });
};

export default authRouter;
