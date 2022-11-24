const socketIo = require('socket.io');
const { http, https } = require('./app');
const cors = require('cors');

let io;
if (process.env.NODE_ENV === 'production') {
    io = socketIo(https, cors({ origin: '*' }));
} else {
    io = socketIo(http);
}

io.on('connection', (socket) => {
    console.log('socket.js connected', socket.id);
});

module.exports = io;
