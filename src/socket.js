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
        console.log(`${socket.nickname} 서버 퇴장`);
        userCnt--;
        console.log(userCnt);
        io.emit('userCount', userCnt);
    });

    socket.on('disconnecting', async () => {
        console.log(`${socket.nickname} 방 퇴장`);
        const msg = `${socket.nickname} 님이 퇴장하셨습니다.`;
        if (socket.roomNum) {
            socket.to(`/gameRoom${socket.roomNum}`).emit('receiveRoomMsg', { notice: msg });
            console.log('비정상적인 퇴장 발생!');
            await RoomProvider.decMember(socket.roomNum);
            let currentMember = await RoomProvider.getCurrentMember(socket.roomNum);
            await RoomProvider.leaveRoom(socket.roomNum);
            io.to(`/gameRoom${socket.roomNum}`).emit('userNickname', currentMember);
            if (socket.isReady === 1) {
                const findRoom = await RoomProvider.getRoom(socket.roomNum);
                await RoomProvider.unready(socket.roomNum);
                await RoomProvider.decMember(socket.roomNum);
                let readyCount = await RoomProvider.readyCount(socket.roomNum);
                const readyStatus = await redis.get(`readyStatus${socket.roomNum}`);
                if (readyStatus !== '') {
                    // setTimeout 이 실행된 후 누군가 ready 를 취소했을 때 그 방의 setTimeout 정지시키기.
                    clearTimeout(readyStatus);
                    await redis.set(`readyStatus${socket.roomNum}`, '');
                    io.sockets.in(`/gameRoom${socket.roomNum}`).emit('stopGame', socket.roomNum);
                }
                if (findRoom.currentCount === Number(readyCount) && findRoom.currentCount > 3) {
                    await GameProvider.readyStatus(socket.roomNum);
                }
            }
            if (socket.isSpy) {
                const msg = `스파이가 퇴장하였습니다`;
                console.log(msg);
                io.to(`/gameRoom${socket.roomNum}`).emit('leaveRoom', { notice: msg });
                await redis.del(`ready${socket.roomNum}`);
                await redis.del(`readyStatus${socket.roomNum}`);
                await redis.del(`currentMember${socket.roomNum}`);
                await redis.del(`gameRoom${socket.roomNum}Result`);
                await redis.del(`gameRoom${socket.roomNum}Users`);
                await redis.del(`nowVote${socket.roomNum}`);
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
