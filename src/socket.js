const socketIo = require('socket.io');
// const { http, https } = require('./app');
const http = require('./app');
const cors = require('cors');
const Room = require('./schemas/room');
require('dotenv').config();

let io;

// if (process.env.NODE_ENV == 'production') {
//     try {
//         io = socketIo(https, cors({ origin: '*' }));
//         console.log('io : HTTPS 로 서버가 실행되었습니다. 포트 :: ' + process.env.PORT);
//     } catch (e) {
//         console.log('io : HTTPS로 서버가 실행되지 않습니다.');
//         console.log(e);
//         io = socketIo(http);
//         console.log('io : HTTP 로 서버가 실행되었습니다. 포트 :: ' + process.env.PORT);
//     }
// } else {
//     io = socketIo(http);
//     console.log('io : HTTP 로 서버가 실행되었습니다. 포트 :: ' + process.env.PORT);
// }
io = socketIo(http);
// io.use((socket, next) => {
//     const err = new Error('fuck');
//     console.log(err.message);
//     next(err);
// });

let userCnt = 0;
io.on('connection', async (socket) => {
    socket.on('getNickname', (nickname) => {
        socket.nickname = nickname;
        socket.emit('getNickname', socket.nickname);
        console.log(socket.nickname);
    });

    userCnt++;
    console.log(socket.id + ' join lobby !');
    console.log(userCnt);
    const shwRoom = await Room.find({});
    io.sockets.emit('showRoom', shwRoom);
    io.emit('userCount', userCnt);

    // 방 조회
    socket.on('showRoom', async () => {
        const shwRoom = await Room.find({});
        io.sockets.emit('showRoom', shwRoom);
    });
});

module.exports = io;
