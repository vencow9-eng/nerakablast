let io = null;

function init(server) {
  const { Server } = require("socket.io");

  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log(
      "socket connected",
      socket.id
    );

    socket.on(
      "disconnect",
      () => {
        console.log(
          "socket disconnected"
        );
      }
    );
  });

  return io;
}

function getIO() {
  return io;
}

module.exports = {
  init,
  getIO,
};