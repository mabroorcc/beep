import SocketIo, { Socket } from "socket.io";
import axios from "axios";
import uuid from "uuid";

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
    const result = await axios.get(AuthServiceUrl + "/a/verify/jwt/" + token);
    const message = result.data.message;
    if (!message) return next(new Error("server internal error"));
    if (message === "Invalid") return next(new Error("Please login again!"));
    next();
  } catch (e) {
    console.log(e.message);
    next(new Error("Invalid Token!"));
  }
});

io.on("connection", (socket: Socket) => {
  socket.on("file-upload", (arg) => {
    // create a channel
    const chan = uuid.v4();

    // add listener to channel
    socket.on(chan, (chunk) => {
      // extract the part no and buff
      const { partNo, buff } = chunk;

      if (partNo === -1) {
        // stop the writing of file to disk

        // emit the finish event and send the url
        socket.emit("file-upload-finish", "url");
      }

      // keep writing to disk
    });

    socket.emit("file-channel", "ajsdour0qwcu3043423");
  });
});

io.listen(4002);
