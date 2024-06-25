
// const socket  = io();
const username = localStorage.getItem("username") || "Anonymous";

const chatIcon = document.getElementById("chatIcon-launcher");

const chatContainer = document.getElementById("chatContainer");
const signInButton = document.getElementById("signInButton");
const minimize = document.getElementById("minimize");
const logout = document.getElementById("logout");
const chatForm= document.getElementById("chatForm");
const chat = document.getElementById("chat");
const messages = document.getElementById("messages");
const usernameInput = document.getElementById("usernameInput");
const messageInput = document.getElementById("messageInput");




chatIcon.addEventListener("click", () => {
  console.log("I am the chat icon ")
  chatContainer.style.display = 'flex'
});