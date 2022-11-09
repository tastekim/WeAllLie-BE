const socketIo = require('socket.io');
const http = require('./app');

const io = socketIo(http);

io.on('connection', (socket) => {
    console.log('socket server connected!');
});