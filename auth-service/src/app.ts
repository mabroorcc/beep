import "reflect-metadata";
import express from "express";
import { createConnection } from "typeorm";
import cookieParser from "cookie-parser";
import authController from "./auth/auth.controller";
import usersController from "./users/users.controller";
import { UsersEntity } from "./users/users.entity";
import cors from "cors";

// Env
const PORT = process.env.PORT;
const DATABASE_HOST = process.env.DATABASE_HOST;
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
const DATABASE_USER = process.env.DATABASE_USER;
const DATABASE = process.env.DATABASE;
const DATABASE_PORT = process.env.DATABASE_PORT;

if (!PORT) throw new Error("PORT not found!");
if (!DATABASE_HOST) throw new Error("DATABASE_HOST not found!");
if (!DATABASE_PASSWORD) throw new Error("DATABASE_PASSWORD not found!");
if (!DATABASE_USER) throw new Error("DATABASE_USER not found!");
if (!DATABASE) throw new Error("DATABASE not found!");
if (!DATABASE_PORT) throw new Error("DATABASE_PORT not found!");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/a", authController);
app.use("/users", usersController);

// Retry logic for database
let connectionAtempts = 0;
function startServer() {
  createConnection({
    type: "postgres",
    host: DATABASE_HOST,
    port: Number(DATABASE_PORT),
    username: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: DATABASE,
    entities: [UsersEntity],
    synchronize: true,
    logging: false,
  })
    .then(() => {
      // Server starting
      app.listen(PORT, () => {
        console.log(`auth-service activated on port ${PORT}`);
      });
    })
    .catch(() => {
      if (connectionAtempts > 5) return;
      connectionAtempts++;
      console.log("auth-service trying to connect to database again...");
      setTimeout(startServer, 2000);
    });
}

// Creating connection and then starting server
startServer();
