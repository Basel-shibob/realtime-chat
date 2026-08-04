const socket = io();

const messagesList = document.getElementById("messages");
let currentUsername = "";

socket.on("connect", () => {
  console.log("connected as", socket.id);
});

socket.on("chat message", (msg) => {
  const li = document.createElement("li");
  li.textContent = `${msg.username}: ${msg.text}`;
  messagesList.appendChild(li);
});

socket.on("user joined", (name) =>{
    const li = document.createElement("li")
    li.textContent = `${name} joined the chat`;
    messagesList.appendChild(li);
});

socket.on("user left", (name) =>{
    const li = document.createElement("li")
    li.textContent = `${name} left the chat`;
    messagesList.appendChild(li);
});

function joinUser(e) {
  e.preventDefault();
  const username = document.getElementById("username-input");
  const name = username.value.trim();
  if (name) {
    socket.emit("join", name);
  }
  currentUsername = name;
  document.getElementById("username-form").style.display = "none";
  document.getElementById("chat").style.display = "block";
}

function sendMessage(e) {
  e.preventDefault();
  const input = document.getElementById("message-input");
  const message = input.value.trim();
  if (message) {
    socket.emit("chat message", { username: currentUsername, text: message });
    input.value = "";
  }
  input.focus();
}

document.getElementById("chat-form").addEventListener("submit", sendMessage);
document.getElementById("username-form").addEventListener("submit", joinUser);
