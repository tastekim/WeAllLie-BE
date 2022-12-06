const socketIo = require('socket.io');
const { http, https } = require('./app');
const cors = require('cors');
const RoomProvider = require('./rooms/room-provider');
const GameProvider = require('./game/game-provider');
const redis = require('./redis');
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
    socket.on('getNickname', (nickname) => {
        socket.nickname = nickname;
        socket.emit('getNickname', socket.nickname);
        console.log(socket.nickname);
    });
    userCnt++;
    console.log(socket.id + ' join lobby !');
    console.log(userCnt);
    socket.roomNum = null;
    const shwRoom = await RoomProvider.getAllRoom();
    io.sockets.emit('showRoom', shwRoom);
    io.emit('userCount', userCnt);

    socket.on('disconnect', async () => {
        console.log(`${socket.nickname} 방 퇴장`);
        const msg = `${socket.nickname} 님이 퇴장하셨습니다.`;
        userCnt--;
        console.log(userCnt);
        io.emit('userCount', userCnt);
        if (socket.rooms.size > 1) {
            socket.to(`/gameRoom${socket.roomNum}`).emit('receiveRoomMsg', { notice: msg });
            console.log('비정상적인 퇴장 발생!');
            await RoomProvider.decMember();
            let currentMember = await RoomProvider.getCurrentMember(socket.roomNum);
            await RoomProvider.leaveRoom(socket.roomNum);
            io.to(`/gameRoom${socket.roomNum}`).emit('userNickname', currentMember);
            if (socket.isReady === 1) {
                const findRoom = await RoomProvider.getRoom();
                await RoomProvider.unready();
                await RoomProvider.decMember();
                let readyCount = await RoomProvider.readyCount(socket.roomNum);
                const readyStatus = await redis.get(`readyStatus${socket.roomNum}`);
                if (readyStatus !== '') {
                    await GameProvider.stopGame(socket.roomNum);
                }
                if (findRoom.currentCount === Number(readyCount) && findRoom.currentCount > 3) {
                    await GameProvider.readyStatus(socket.roomNum);
                }
            }
        }
    });

    // 방 조회
    socket.on('showRoom', async () => {
        const shwRoom = await RoomProvider.getAllRoom();
        io.sockets.emit('showRoom', shwRoom);
    });
});

module.exports = io;
