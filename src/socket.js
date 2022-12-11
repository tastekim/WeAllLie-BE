const socketIo = require('socket.io');
const { http, https } = require('./app');
//const http = require('./app');
const cors = require('cors');
const RoomProvider = require('./rooms/room-provider');
require('dotenv').config();

let io;

if (process.env.NODE_ENV == 'production') {
    try {
        io = socketIo(https, cors({ origin: '*' }));
        console.log('io : HTTPS 로 서버가 실행되었습니다. 포트 :: ' + process.env.PORT);
    } catch (e) {
        console.log('io : HTTPS로 서버가 실행되지 않습니다.');
        console.log(e);
        io = socketIo(http);
        console.log('io : HTTP 로 서버가 실행되었습니다. 포트 :: ' + process.env.PORT);
    }
} else {
    io = socketIo(http);
    console.log('io : HTTP 로 서버가 실행되었습니다. 포트 :: ' + process.env.PORT);
}

let userCnt = 0;

io.on('connection', async (socket) => {
    try {
        userCnt++;
        console.log(socket.id + ' join lobby !');
        socket.roomNum = null;
        const shwRoom = await RoomProvider.getAllRoom();
        io.sockets.emit('showRoom', shwRoom);
        io.emit('userCount', userCnt);
    } catch (err) {
        socket.emit('error', (err.statusCode ??= 500), err.message);
    }
    socket.on('getNickname', (nickname) => {
        try {
            socket.nickname = nickname;
            socket.emit('getNickname', nickname);
            console.log(nickname);
        } catch (err) {
            socket.emit('error', (err.statusCode ??= 500), err.message);
        }
    });

    socket.on('disconnect', async () => {
        try {
            console.log(`${socket.nickname} 서버 퇴장`);
            userCnt--;
            console.log(userCnt);
            io.emit('userCount', userCnt);
        } catch (err) {
            socket.emit('error', (err.statusCode ??= 500), err.message);
        }
    });

    // 방 조회
    socket.on('showRoom', async () => {
        try {
            const shwRoom = await RoomProvider.getAllRoom();
            io.sockets.emit('showRoom', shwRoom);
        } catch (err) {
            socket.emit('error', (err.statusCode ??= 400), err.message);
        }
    });
});

module.exports = io;
