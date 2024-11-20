const express = require('express')
const app = express()
const PORT = 3000;
const socketio = require("socket.io");
console.log("Server is listening...");

const server = app.listen((process.env.PORT || 3000), () => {
    console.log('server is active...');
    
})

app.get('/',(req,res) => {
    res.send('i am active')
})

const io = socketio(server)

io.of("/").on("connect", (socket) => {
    socket.on("join", (data) => {
        console.log("\n%s", data);
        console.log("Nickname: ", data.sender, ", ID: ", socket.id);
        console.log("Number of clients: %d", io.of('/').server.engine.clientsCount);
         socket.nickname = data.sender;
         socket.broadcast.emit("join", data);
    });

    socket.on("broadcast", (data) => {
        console.log("\n%s", data);
        socket.broadcast.emit("broadcast", data);
    });

    socket.on("quit", (data) => {
        console.log("\n%s", data);
        socket.broadcast.emit("quit", data);
        socket.disconnect(true);
    });
    
    socket.on("disconnect", (reason) => {
        console.log("\nA client disconnected, reason: %s", reason);
        console.log("Number of clients: %d", io.of('/').server.engine.clientsCount);
    });
});

