const io = require("socket.io-client");
const socket = io("http://172.20.10.5:3000");
const figlet = require('figlet')

figlet("Heaven", function (err, data) {
    if (err) {
      console.log("Something went wrong...");
      console.dir(err);
      return;
    }
    console.log(data);
  });

var nickname = null;
console.log("Connecting to the server...");
socket.on("connect", () => {
    nickname = process.argv[2];
    console.log("[INFO]: Welcome %s", nickname);
    socket.emit("join", {"sender": nickname, "action": "join"});
});
socket.on("disconnect", (reason) => {
    console.log("[INFO]: Client disconnected, reason: %s", reason);
});
socket.on("join", (data) => {
    console.log("[INFO]: %s has joined the chat", data.sender);
});

const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
rl.on("line", (input) => {
    if (true === input.startsWith("s>")) {
        var str = input.slice(2);
        socket.emit("broadcast", {"sender": nickname, "action": "broadcast", "msg": str});
    }
    else if ("q>" === input) {
        socket.emit("quit", {"sender": nickname, "action": "quit"});
    }
});
socket.on("broadcast", (data) => {
    console.log(`[${data.sender}] ${data.msg}`);
});
socket.on("quit", (data) => {
    console.log("[INFO]: %s left the chat", data.sender);
});
