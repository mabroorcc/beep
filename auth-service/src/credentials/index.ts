export const CLIENT_ID = `176671414954-jqo54safscb71696puelddpe9jie1avn.apps.googleusercontent.com`;
export const CLIENT_SECRET = `YoU4ciu1T9qOvFT9Wh1ltTLt`;
export const JWT_SECRET = `Hsd0F6-_nzSrSiFbaP`;

// Create a scope what you want to use
export const SCOPE =
  encodeURIComponent("https://www.googleapis.com/auth/userinfo.email") +
  " " +
  encodeURIComponent("https://www.googleapis.com/auth/userinfo.profile");

export const REDIRECT_URI_ENCODED = encodeURIComponent(
  `http://localhost:4000/auth/a/login/google/callback`
);
export const REDIRECT_URI = `http://localhost:4000/auth/a/login/google/callback`;
export const FIRST_LOGIN_REDIRECT = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI_ENCODED}&scope=${SCOPE}`;
