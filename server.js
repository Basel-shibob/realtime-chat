const express = require("express");
const http = require("node:http");
const path = require("path");
const { Server } = require("socket.io");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);
const PORT = process.env.PORT || 3000;

function getUsersInRoom(room){
  const roomData = io.sockets.adapter.rooms.get(room);
  if(!roomData) return [];
  return Array.from(roomData)
    .map((socketId) => io.sockets.sockets.get(socketId)?.username)
    .filter(Boolean);
}

io.on("connection", (socket) => {
  console.log("socket connected:", socket.id);

  socket.on("join", ({ username, room }) => {
    if (
      typeof username !== "string" ||
      username.trim().length === 0 ||
      username.length > 30 ||
      typeof room !== "string" ||
      room.trim().length === 0 ||
      room.length > 30
    ) {
      return;
    }
    socket.username = username.trim();
    socket.room = room.trim();
    socket.join(socket.room);
    io.to(socket.room).emit("online users", getUsersInRoom(socket.room));
    socket.to(socket.room).emit("user joined", socket.username);
  });

  socket.messageTimestamps = [];

  socket.on("chat message", (msg) => {
    const now = Date.now();
    socket.messageTimestamps = socket.messageTimestamps.filter(
      (t) => now - t < 10000
    );
    if (socket.messageTimestamps.length >= 10) {
      return; // more than 10 messages in 10 seconds - drop it
    }
    socket.messageTimestamps.push(now);
    if (
      typeof msg !== "object" ||
      typeof msg.text !== "string" ||
      msg.text.trim().length === 0 ||
      msg.text.length > 500 ||
      typeof msg.username !== "string"
    ) {
      return;
    }
    io.to(socket.room).emit("chat message", {
      username: msg.username,
      text: msg.text.trim(),
    });
  });
  
  socket.on("typing", (username) =>{
    if(typeof username !== "string" || !socket.room) return;
    socket.to(socket.room).emit("typing", username)
  });

  socket.on("stop typing", () =>{
    if(!socket.room) return;
    socket.to(socket.room).emit("stop typing")
  });

  socket.on("disconnect", (reason) => {
    console.log("socket disconected:", socket.id, reason);
    if (socket.username && socket.room) {
      socket.leave(socket.room);
      io.to(socket.room).emit("online users", getUsersInRoom(socket.room));
      socket.to(socket.room).emit("user left", socket.username);
    }
  });
});

app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use(errorHandler);

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection:", err);
});

httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
