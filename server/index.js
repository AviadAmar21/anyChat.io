const express = require('express');
const cors = require('cors');
const socketio = require('socket.io');
const http = require('http');

const PORT = process.env.PORT  || 5000;

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(router);

io.on('connection', (socket) => {
    console.log('We have a connection!!' , socket);

    socket.on('disconnect' , () => {
        console.log('User had left!');
    })
})

server.listen(PORT , () => {
    console.log(`server running at ${PORT} port..`);
})
