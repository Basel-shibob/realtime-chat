const express = require("express");
const http = require("node:http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);
const PORT = process.env.PORT || 3000;

io.on("connection", (socket) => {
  console.log("socket connected:", socket.id);

  socket.on("join", (username) => {
    if (
      typeof username !== "string" ||
      username.trim().length === 0 ||
      username.length > 30
    ) {
      return;
    }
    socket.username = username.trim();
    socket.broadcast.emit("user joined", socket.username);
  });

  socket.on("chat message", (msg) => {
    if (
      typeof msg !== "object" ||
      typeof msg.text !== "string" ||
      msg.text.trim().length === 0 ||
      msg.text.length > 500 ||
      typeof msg.username !== "string"
    ) {
      return;
    }
    io.emit("chat message", { username: msg.username, text: msg.text.trim() });
  });

  socket.on("disconnect", (reason) => {
    console.log("socket disconected:", socket.id, reason);
	if(socket.username){
		socket.broadcast.emit("user left", socket.username);
	}
  });
});

app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
  res.send("Server is running");
});

httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
