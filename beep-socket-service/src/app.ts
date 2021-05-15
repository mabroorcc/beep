import SocketIo, { Socket } from "socket.io";
import axios from "axios";

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

let connections: Map<string, Socket> = new Map();

io.on("connection", (socket) => {
  const email = socket.handshake.auth.user.email as string;

  connections.set(email, socket);

  socket.on("add-to-recent", (userId) => {
    // add to recent
  });

  socket.on("check-user-online", (email, res: (res: any) => void) => {
    // check if the user is online
    const user = connections.get(email);
    if (user) return res(user);
    res(null);
  });

  socket.on("offline", () => {
    connections.delete(socket.id);
  });

  socket.on("disconnect", () => {
    connections.delete(socket.id);
  });
});

const PORT = process.env.BEEP_SOCKET_SERVICE || 4003;

io.listen(Number(PORT));
