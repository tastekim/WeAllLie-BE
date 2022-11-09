const socketIo = require('socket.io');
const http = require('./app');
const GameProvider = require('./game/game-provider');
const GameRepo = require('./game/game-repo');

const io = socketIo(http);

io.on('connection', (socket) => {
    console.log('socket server connected!');
});