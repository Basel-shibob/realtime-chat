const socket = io();

const messagesList = document.getElementById("messages");
const input = document.getElementById("message-input");
let currentUsername = "";
let typingTimeout;

socket.on("connect", () => {
  console.log("connected as", socket.id);
});

socket.on("chat message", (msg) => {
  const li = document.createElement("li");
  li.textContent = `${msg.username}: ${msg.text}`;
  messagesList.appendChild(li);
});

socket.on("user joined", (name) => {
  const li = document.createElement("li");
  li.textContent = `${name} joined the chat`;
  messagesList.appendChild(li);
});

socket.on("user left", (name) => {
  const li = document.createElement("li");
  li.textContent = `${name} left the chat`;
  messagesList.appendChild(li);
});

socket.on("typing", (name) =>{
  document.getElementById("typing-indicator").textContent = `${name} is typing...`;
});

socket.on("stop typing", () =>{
  document.getElementById("typing-indicator").textContent = ""
});

socket.on("online users", (users) =>{
  const list = document.getElementById("online-list")
  list.innerHTML = "";
  users.forEach((name) => {
    const li = document.createElement("li");
    li.textContent = name;
    list.appendChild(li);
  });
});

socket.on("chat history", (messages) =>{
  messages.forEach((msg) =>{
    const li = document.createElement("li");
    li.textContent = `${msg.username}: ${msg.text}`;
    messagesList.appendChild(li);
  })
})

input.addEventListener("input", () =>{
  socket.emit("typing", currentUsername);
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    socket.emit("stop typing");
  }, 1000);
});

function joinUser(e) {
  e.preventDefault();
  const username = document.getElementById("username-input");
  const room = document.getElementById("room-input").value.trim();
  const name = username.value.trim();
  if (name && room) {
    socket.emit("join", { username: name, room });
    currentUsername = name;
    document.getElementById("username-form").style.display = "none";
    document.getElementById("chat").style.display = "block";
  }
}

function sendMessage(e) {
  e.preventDefault();
  const message = input.value.trim();
  if (message) {
    socket.emit("chat message", { username: currentUsername, text: message });
    input.value = "";
  }
  input.focus();
}

document.getElementById("chat-form").addEventListener("submit", sendMessage);
document.getElementById("username-form").addEventListener("submit", joinUser);
