const socket = io();
const username = localStorage.getItem("username") || "Anonymous";

const chatIconLauncher = document.getElementById("chatIcon-launcher");

const chatContainer = document.getElementById("chatContainer");
const signInButton = document.getElementById("signInButton");
const minimize = document.getElementById("minimize-x");
const logout = document.getElementById("logout");
const form = document.getElementById("form");
const chat = document.getElementById("chat");
const messages = document.getElementById("messages");
const usernameInput = document.getElementById("usernameInput");
const messageInput = document.getElementById("messageInput");
let chatOpen = false;

minimize.addEventListener("click", () => {
  chatContainer.style.display = "none";
  chatIconLauncher.querySelector(".chatIcon-open").style.display = "flex";
  chatIconLauncher.querySelector(".chatIcon-minimize").style.display = "none";
});

chatIconLauncher.addEventListener("click", () => {
  chatOpen = !chatOpen;
  if (chatOpen) {
    chatContainer.style.display = "flex";
    chatIconLauncher.querySelector(".chatIcon-open").style.display = "none";
    chatIconLauncher.querySelector(".chatIcon-minimize").style.display = "flex";
    chatIconLauncher.querySelector(".chatIcon-minimize").style.opacity = 1;
  } else {
    chatContainer.style.display = "none";
    chatIconLauncher.querySelector(".chatIcon-open").style.display = "flex";
    chatIconLauncher.querySelector(".chatIcon-minimize").style.display = "none";
  
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputElement = form.getElementsByTagName("input")[0];
  if (inputElement.value.length === 0) return;
});


// socket.on('chat message', function(msg) {
//   var item = document.createElement('li');
//   item.textContent = msg;
//   document.getElementById('messages').appendChild(item);
//   window.scrollTo(0, document.body.scrollHeight);
// });