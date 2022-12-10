const socketIo = require('socket.io');
// const { http, https } = require('./app');
const http = require('./app');
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

    socket.on('disconnecting', async () => {
        try {
            console.log(`${socket.nickname} 방 퇴장`);
            const msg = `${socket.nickname} 님이 퇴장하셨습니다.`;
            if (socket.roomNum) {
                const msgId = new Date().getTime().toString(36);
                io.sockets.emit('receiveRoomMsg', { notice: msg }, msgId, socket.roomNum);
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
                    if (findRoom.currentCount === Number(readyCount) && findRoom.currentCount > 3) {
                        console.log('게임 시작 ! ');
                        // 스파이 랜덤 지정 후 게임 시작 전 emit.
                        const spyUser = await GameProvider.selectSpy(roomNum);
                        lobby.sockets.in(`/gameRoom${roomNum}`).emit('spyUser', spyUser);
                        if (nickname === spyUser) {
                            socket.isSpy = 1;
                        }
                        // 카테고리 및 제시어 랜덤 지정 후 게임 시작과 같이 emit.
                        const gameData = await GameProvider.giveWord(roomNum);
                        lobby.sockets.in(`/gameRoom${roomNum}`).emit('gameStart', gameData);
                        // 게임방 진행 활성화. 다른 유저 입장 제한.
                        await RoomProvider.getTrue(roomNum);
                        await redis.del(`ready${roomNum}`);
                        await redis.del(`readyStatus${roomNum}`);
                        await redis.del(`currentMember${roomNum}`);
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
