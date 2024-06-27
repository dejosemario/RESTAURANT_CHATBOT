const express = require("express");
const path = require("path");
const app = express();
const server = require("http").createServer(app);
const { Server } = require("socket.io");

const PORT = process.env.PORT || 3000;

const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

// Serve the HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

io.on("connection", (socket) => {
 console.log("a user connected");
  console.log(socket.id);

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });

  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
    io.emit("chat message", msg);
  });
});

server.listen(3000, () => {
  console.log(`Server running on port ${PORT}`);
});
