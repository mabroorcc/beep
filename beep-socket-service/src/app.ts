import SocketIo from "socket.io";
import "reflect-metadata";
import { createConnection } from "typeorm";
import axios from "axios";
import { Chats } from "./chats/chat.entity";
import { Members } from "./members/members.entity";
import { Messages } from "./messages/messages.entity";
import { InjectApiTo } from "./api";

// Env
const PORT = process.env.BEEP_SOCKET_SERVICE_PORT || 4003;
const DBHOST = process.env.BEEP_SOCKET_SERVICE_DBHOST || "localhost";
const DBPASSWORD = process.env.BEEP_SOCKET_SERVICE_DBPASSWORD || "pwd";
const DBUSER = process.env.BEEP_SOCKET_SERVICE_DBUSER || "postgres";
const DB = process.env.BEEP_SOCKET_SERVICE_DB || "test";
const DBPORT = process.env.BEEP_SOCKET_SERVICE_DBPORT || 5433;

const io = new SocketIo.Server({ cors: { origin: "*" } });

export const AuthServiceUrl =
  process.env.AUTH_SERVICE_URL || "http://auth-service:4001";

// auth middleware
io.use(async (socket, next) => {
  const token = socket.handshake.auth.jwtId;
  const user = socket.handshake.auth.user;
  if (!user) {
    next(new Error("Invalid credentials!"));
  }
  if (!token) {
    next(new Error("Please login first!"));
  }

  try {
    // sending the request to auth-service to ensure the validity of the token
    const result = await axios.get(AuthServiceUrl + "/a/verify/jwt/" + token);
    const message = result.data.message;
    if (!message) {
      console.log(message);
      return next(new Error("server internal error"));
    }
    if (message === "Invalid") {
      console.log(message);
      return next(new Error("Please login again!"));
    }
    next();
  } catch (e) {
    console.log(e.message);
    next(new Error("Invalid Token!"));
  }
});

io.on("connection", (socket) => {
  InjectApiTo(socket);
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
    entities: [Chats, Members, Messages],
    synchronize: true,
    logging: false,
  })
    .then(() => {
      // Server starting
      io.listen(Number(PORT));
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
