const express = require("express");
const { join } = require("path");

const app = express();
const server = require("http").createServer(app);
const {Server} = require("socket.io");

const PORT = process.env.PORT || 3000;

const io = new Server(server);

app.use(express.static(join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
    io.emit("chat message", msg);
  });
});

server.listen(3000, () => {
  console.log(`Server running on port ${PORT}`);
});
