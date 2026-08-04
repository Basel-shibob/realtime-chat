const express = require("express");
const http = require("node:http");
const path = require("path")
const { Server } = require("socket.io");

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);
const PORT = process.env.PORT || 3000;

io.on("connection", (socket) => {
	console.log('socket connected:', socket.id);

	socket.on("chat message", (msg) => {
		if(typeof msg !== "string" || msg.trim().length === 0 || msg.length > 500) {
			return;
		}
		io.emit("chat message", msg.trim());
	});

	socket.on("disconnect", (reason) => {
		console.log("socket disconected:", socket.id, reason);
	});
})

app.use(express.static( path.join(__dirname,"/public")));

app.get("/", (req, res) => {
  res.send("Server is running");
});

httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
