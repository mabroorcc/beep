import SocketIo, { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import axios from "axios";
import * as utils from "./utils";

const io = new SocketIo.Server({ cors: { origin: "*" } });

export const JWT_SECRET = `Hsd0F6-_nzSrSiFbaP`;
export const AuthServiceUrl =
  process.env.AUTH_SERVICE_URL || "http://auth-service:4001";

// auth middleware
io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    next(new Error("Please login first!"));
  }

  try {
    const user = jwt.verify(token, JWT_SECRET);
    const decodedUser = utils.getUserFromJwtToken(user);
    const result = await axios.get(
      AuthServiceUrl + "/verify/jwt/" + decodedUser.jwtId
    );
    if (!result) return next(new Error("Please login again!"));
    socket.handshake.auth.user = decodedUser;
  } catch (e) {
    next(new Error("Invalid Token!"));
  }
});

io.on("connection", (socket: Socket) => {
  socket.on("file-upload", () => {
    console.log(socket.handshake.auth.user);
  });
});

io.listen(4002);
