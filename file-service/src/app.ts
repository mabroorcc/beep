import SocketIo, { Socket } from "socket.io";
import axios from "axios";
import * as uuid from "uuid";
import fs, { WriteStream } from "fs";
import path from "path";

const io = new SocketIo.Server({ cors: { origin: "*" } });

const PORT = process.env.FILE_SERVICE_PORT;
const FILES_HOST = process.env.FILES_HOST;
const AuthServiceUrl = process.env.AUTH_SERVICE_URL;

if (!PORT) throw new Error("FILE_SERVICE_PORT was not found!");
if (!FILES_HOST) throw new Error("FILES_HOST was not found!");
if (!AuthServiceUrl) throw new Error("AUTH_SERVICE_URL was not found!");

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

io.on("connection", (socket: Socket) => {
  let uploadJobs: { fileId: string; stream: WriteStream }[] = [];

  socket.on("file-received", (filename) => {
    fs.unlink(path.resolve(__dirname + "/../files/" + filename), (err) => {
      if (err) return socket.emit("file-err", err);
      socket.emit("file-done");
    });
  });

  socket.on("file-upload", (arg) => {
    // get the metadata from the arg and validate
    const fileMetadata = getValidatedFileUploadArgs(arg);

    if (!fileMetadata) {
      socket.emit("file-error", "invalid metadata!");
      return socket.disconnect();
    }

    // a unique id to be used for upload channel and for url
    const fileId = uuid.v4();

    // creating a stream
    const stream = fs.createWriteStream(
      path.resolve(__dirname + "/../files/" + fileId + fileMetadata.fileName)
    );

    // Tracking the upload for saftey
    uploadJobs.push({ fileId, stream });

    // add listener to channel where the chunks of the file will come
    socket.on(fileId, (chunk) => {
      // extract the part no and buff
      const { partNo, buff } = chunk;

      if (!partNo && !buff) {
        // close the channel and delete the file to terminate
        socket.emit("upload-error", "Invalid file chunk");
        socket.disconnect(true);
      }

      if (partNo === -1) {
        // write the last part
        stream.write(buff);

        // emit The progress
        socket.emit(
          fileId,
          ((partNo * fileMetadata.chunkSize) / fileMetadata.fileSize) * 100
        );

        // stop the writing of file to disk
        stream.end();

        // emit the finish event and send the url
        socket.emit(
          "file-upload-finish",
          `${FILES_HOST}/${fileId}${fileMetadata.fileName}`
        );

        // remove the job because its finished
        uploadJobs = uploadJobs.filter((job) => job.fileId !== fileId);
        return;
      }

      // keep writing to disk
      stream.write(buff);

      // emit The progress
      socket.emit(
        fileId,
        ((partNo * fileMetadata.chunkSize) / fileMetadata.fileSize) * 100
      );
    });

    // sending the channel to the client so that he can send chunks on that channel
    socket.emit("file-channel", fileId);
  });

  // when user disconnects
  socket.on("disconnect", () => {
    // find all ongoing jobs
    uploadJobs.forEach((job) => {
      // end the stream
      job.stream.end();

      // delete the uncomplete file
      fs.rm(__dirname + "/files/" + job.fileId, () => {
        console.log("Job " + job.fileId + " Closed!");
      });
    });
  });
});

const getValidatedFileUploadArgs = (
  arg: any
): { fileName: string; fileSize: number; chunkSize: number } | undefined => {
  const { fileName, fileSize, chunkSize } = arg;
  // Validation
  if (
    !fileName ||
    typeof fileName !== "string" ||
    !fileSize ||
    typeof fileSize !== "number" ||
    !chunkSize ||
    typeof chunkSize !== "number"
  ) {
    return undefined;
  }

  return { fileName, fileSize, chunkSize };
};

io.listen(Number(PORT));
