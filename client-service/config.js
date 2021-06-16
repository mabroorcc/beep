const fs = require("fs");

const FILE_SERVICE_HOST = process.env.FILE_SERVICE_HOST;
const AUTH_SERVICE_HOST = process.env.AUTH_SERVICE_HOST;
const SOCKET_SERVICE_HOST = process.env.SOCKET_SERVICE_HOST;

if (!FILE_SERVICE_HOST) throw new Error("file service host was not found!");
if (!AUTH_SERVICE_HOST) throw new Error("auth service host was not found!");
if (!SOCKET_SERVICE_HOST) throw new Error("socket service host was not found!");

const data = `export const ENV = {
  FILE_SERVICE_HOST: ${FILE_SERVICE_HOST},
  AUTH_SERVICE_HOST: ${AUTH_SERVICE_HOST},
  SOCKET_SERVICE_HOST: ${SOCKET_SERVICE_HOST},
  DEFAULT_CHAT_IMAGE_URL: "http://picsum.photos/400/400",
}`;

fs.writeFile("./src/env.ts", data, {}, (err) => {
  if (err) return console.log(err);
  console.log(`Configured 
    FILE_SERVICE_HOST = ${FILE_SERVICE_HOST} 
    AUTH_SERVICE_HOST = ${AUTH_SERVICE_HOST}
    SOCKET_SERVICE_HOST = ${SOCKET_SERVICE_HOST}
  `);
});
