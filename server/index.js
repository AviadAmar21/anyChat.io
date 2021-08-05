const express = require('express');
const http = require('http');
const cors = require('cors');
const socketio = require('socket.io');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

const PORT = process.env.PORT || 3002;

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});

app.use(cors());
app.use(router);

io.on('connection', (socket) => {
    console.log('We have a connection!!');

    socket.on('join', ({ name }, callback) => {
        const { error, user } = addUser({ id: socket.id, name});

        if (error) return callback(error);

        socket.emit('message', { user: 'admin', text: `${user.name}, Welcome to Anychat.io main room!` });
        socket.broadcast.to('mainRoom').emit('message',{ user:'admin', text:`${user.name}, has joined!` });

        socket.join('mainRoom');

        io.to('mainRoom').emit('roomData', { room: 'mainRoom', users: getUsersInRoom()});

        callback();
    });

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);

        io.to('mainRoom').emit('message', { user: user.name, text: message });
        io.to('mainRoom').emit('roomData', { room: 'mainRoom', users: getUsersInRoom() });

        callback();
    });

    socket.on('disconnect' , () => {
        const user = removeUser(socket.id);

        if(user) {
            io.to('mainRoom').emit('message', { user: 'admin', text: `${user.name} has left.`})
        }
    }) 
})

server.listen(PORT , () => {
    console.log(`server running at ${PORT} port..`);
})
