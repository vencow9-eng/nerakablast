require("dotenv").config();

const http = require("http");
const app = require("./app");
const socket = require("./config/socket");

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

socket.init(server);

server.listen(PORT, () => {
  console.log(`RUPIAHBLAST backend running on port ${PORT}`);
});