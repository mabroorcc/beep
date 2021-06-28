// These should be the environment variables
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const GOOGLE_USER_EMAIL_SCOPE = process.env.GOOGLE_USER_EMAIL_SCOPE;
const GOOGLE_USER_PROFILE_SCOPE = process.env.GOOGLE_USER_PROFILE_SCOPE;
const AUTH_REDIRECT_URI = process.env.AUTH_REDIRECT_URI;

if (!CLIENT_ID) throw new Error("CLIENT_ID not found");
if (!CLIENT_SECRET) throw new Error("CLIENT_SECRET not found");
if (!GOOGLE_USER_EMAIL_SCOPE)
  throw new Error("GOOGLE_USER_EMAIL_SCOPE not found");
if (!GOOGLE_USER_PROFILE_SCOPE)
  throw new Error("GOOGLE_USER_PROFILE_SCOPE not found");
if (!AUTH_REDIRECT_URI) throw new Error("AUTH_REDIRECT_URI not found");

export { CLIENT_ID, CLIENT_SECRET };

// Create a scope what you want to use
export const SCOPE =
  encodeURIComponent(GOOGLE_USER_EMAIL_SCOPE) +
  " " +
  encodeURIComponent(GOOGLE_USER_PROFILE_SCOPE);

export const REDIRECT_URI_ENCODED = encodeURIComponent(AUTH_REDIRECT_URI);
export const REDIRECT_URI = AUTH_REDIRECT_URI;
export const FIRST_LOGIN_REDIRECT = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI_ENCODED}&scope=${SCOPE}`;
