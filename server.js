const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const btoa = require("btoa");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
const server = http.createServer(app);
const io = socketio(server);

const rooms = { PHP: "php", JAVASCRIPT: "javascript" };
const users = { php: [], javascript: [] };

app.get("/", (req, res) => {
  res.send("SERVER WORKING");
});

app.post("/newJoin", (req, res) => {
  console.log(req.body);
  res.send(
    JSON.stringify({ key: btoa(req.body.uname + ":" + req.body.rName) })
  );
});

io.on("connection", (s) => {
  // Tell users new joined
  if (s.handshake.query.room == rooms.PHP) {
    if (!users.php.includes(s.handshake.query.user)) {
      users.php.push(s.handshake.query.user);
    }
  } else if (s.handshake.query.room == rooms.JAVASCRIPT) {
    if (!users.javascript.includes(s.handshake.query.user)) {
      users.javascript.push(s.handshake.query.user);
    }
  }
  io.emit("message", {
    user: s.handshake.query.user,
    room: s.handshake.query.room,
    currentUsers: users,
  });

  // When a message is received
  io.on("roomMessage", (data) => {
    console.log(data);
    io.emit("roomMessage", data);
  });

  // When someone leaves
  io.on("disconnect", () => {
    io.emit("message", "A user left");
  });
});

const PORT = 5000 || process.env.PORT;

server.listen(PORT, () => console.log("Server on " + PORT));
