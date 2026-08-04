const socket = io();

const messagesList = document.getElementById("messages");

socket.on("connect", () => {
  console.log("connected as", socket.id);
});
socket.on("chat message", (msg) => {
  const li = document.createElement("li");
  li.textContent = msg;
  messagesList.appendChild(li);
});
function sendMessage(e) {
  e.preventDefault();
  const input = document.querySelector("input");
  const message = input.value.trim();
  if (message) {
    socket.emit("chat message", message);
    input.value = "";
  }
  input.focus();
}

document.querySelector("form").addEventListener("submit", sendMessage);
