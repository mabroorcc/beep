import "reflect-metadata";
import express from "express";
import { createConnection } from "typeorm";
import cookieParser from "cookie-parser";
import authController from "./auth/auth.controller";
import usersController from "./users/users.controller";
import { UsersEntity } from "./users/users.entity";
import cors from "cors";

// Env
const PORT = process.env.PORT || 4001;
const DATABASE_HOST = process.env.DATABASE_HOST || "auth-db";
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || "pwd";
const DATABASE_USER = process.env.DATABASE_USER || "postgres";
const DATABASE = process.env.DATABASE || "authdb";
const DATABASE_PORT = process.env.DATABASE_PORT || 5432;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/a", authController);
app.use("/users", usersController);

//app.use("*", (req, res) => {
//res.status(404).send("Endpoint not found!" + JSON.stringify(req.body));
//});

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
