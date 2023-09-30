// Node Server which will handle socket io connections.
// Websocket acts as a middleware (or is present) between the client and the server.
// Websocket is an event driven transfer thing. The client and server emits the information or communicates with each other by sending events.
const io = require('socket.io')(8000, {
    // cors: {origin: ["192.168.137.1", "192.168.0.105", "192.168.0.106"]},
    cors: {origin: ["http://127.0.0.1:5500"]},  // origin 
    // cors: {origin: "*"}
})

const express = require('express');
const app = express();

// The following code will not work as app.use() is the backend and we are allowing access the request to the "backend" from any domain. But we want to tell "websocket" and not the "backend" to llow access from the origin. Refer above cors: {origin} for letting "websocket" accept request from the origin (or from any domain i.e "*").
// const cors = require('cors');
// app.use(
//     cors({
//         // origin: "http://127.0.0.1:5500",
//         origin: "*",
//     })
// )

const users = {};

// 'on' means 'listening' i.e, the socket is listening for io connection (io.on) and for events fired by the individual instances (socket.on)
io.on('connection', socket => {
    // socket.functonName('id', variable/call-back/object);
    // listen when any new user joins
    socket.on('new-user-joined', name => {
        console.log(name);
        users[socket.id] = name;
        // send/emit/broadcast the 'new-user-joined' event to all other clients except the one from where the message has come.
        socket.broadcast.emit('user-joined', name);
    })

    // listen for a message sent by a client
    socket.on('send', message => {
        // broadcast the message to all other clients except the one from where the message has come.
        socket.broadcast.emit('recieve', {name: users[socket.id], text: message});
    })

    // listen for 'disconnect' event from a client who has left the chat
    socket.on('disconnect', () => {
        // send 'left' event to all the clients
        socket.broadcast.emit('left', {name: users[socket.id]});
        // delete the client who has left the chat from the client name/id array
        delete users[socket.id];
    })
})
