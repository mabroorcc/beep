import "reflect-metadata";
import express from "express";
import { createConnection } from "typeorm";
import Redis from "redis";
//import UserRouter from "./users/user.controller";
//import UserEntity from "./users/user.entity";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Env
const PORT = process.env.PORT || 4000;
const DBHOST = process.env.DBHOST || "localhost";
const DBPASSWORD = process.env.DBPASSWORD || "pwd";
const DBUSER = process.env.DBUSER || "postgres";
const DB = process.env.DB || "authdb";
const DBPORT = process.env.DBPORT || 5432;
const REDIS_URL = process.env.REDIS_URL || "";

// setting up cache
const redis = Redis.createClient(REDIS_URL);

const getCacheByKey = (key: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    redis.get(key, (err, res) => {
      if (res) return resolve(res);
      reject(err);
    });
  });
};

// Middleware for cross-origin
app.use(cors({ origin: "*" }));

// Middleware for parsing incoming cookies
app.use(cookieParser());

// Middleware to parse json data
app.use(express.json());

// Injecting user router in application
//app.use("/user", UserRouter);

app.get("/", async (_req, res) => {
  res.json({ thanks: "!" });
});

// Retry logic for database
let connectionAtempts = 0;
function startServer() {
  createConnection({
    type: "postgres",
    host: DBHOST,
    port: Number(DBPORT),
    username: DBUSER,
    password: DBPASSWORD,
    database: DB,
    entities: [],
    synchronize: true,
    logging: false,
  })
    .then(() => {
      // Server starting
      app.listen(PORT, () => {
        console.log(
          `auth-service running` //on port ${PORT} with database ${DBHOST}-${DBPORT} and cache ${CACHE}-${CPORT}`
        );
      });
    })
    .catch(() => {
      if (connectionAtempts > 5) return;
      connectionAtempts++;
      console.log("Trying to connect again...");
      setTimeout(startServer, 2000);
    });
}

// Creating connection and then starting server
startServer();
