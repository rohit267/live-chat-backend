const express = require("express");
const http = require("http");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on("connection", (s) => {
  console.log("New Connection");
  s.emit("message", "Welcome to liveChat");

  s.broadcast.emit("message", "A user joined the chat");

  s.on("disconnect", () => {
    io.emit("message", "A user left");
  });
});

const PORT = 5000 || process.env.PORT;

server.listen(PORT, () => console.log("Server on " + PORT));
