const io = require('../socket');
const RoomProvider = require('./room-provider');
const redis = require('../redis');

io.on('connection', async (socket) => {
    socket.on('disconnecting', async () => {
        try {
            const nickname = socket.nickname;
            console.log(`${socket.nickname} 방 퇴장`);
            const msg = `${socket.nickname} 님이 퇴장하셨습니다.`;
            const roomNum = socket.roomNum;
            const roomStatus = await RoomProvider.getRoomStatus(roomNum);
            // 방에 입장해있는 인원이 게임 시작 전퇴장 하였을 경우
            if (roomNum && roomStatus === false) {
                const msgId = new Date().getTime().toString(36);
                io.sockets.emit('receiveRoomMsg', { notice: msg }, msgId, roomNum);
                await RoomProvider.leaveRoom(roomNum);
                await RoomProvider.decMember(roomNum);
                if (socket.isReady === 1) {
                    // 방에 있다가 준비를 한 상태로 퇴장한 경우
                    await RoomProvider.unready(roomNum);
                    socket.emit('leaveRoom');
                    let currentMember = await RoomProvider.getCurrentMember(roomNum);
                    io.to(`/gameRoom${roomNum}`).emit('userNickname', currentMember);
                    io.sockets.in(`/gameRoom${roomNum}`).emit('ready', nickname, false);
                    await redis.set(`ready${roomNum}`, 0);
                } else {
                    // 준비를 안한 상태로 퇴장한 경우
                    socket.emit('leaveRoom');
                    let currentMember = await RoomProvider.getCurrentMember(roomNum);
                    io.to(`/gameRoom${roomNum}`).emit('userNickname', currentMember);
                    io.sockets.in(`/gameRoom${roomNum}`).emit('ready', nickname, false);
                    await redis.set(`ready${roomNum}`, 0);
                }
                // 게임 시작 후 방에 있는 사람이 나갔을 경우
                if (roomNum && roomStatus === true) {
                    const msgId = new Date().getTime().toString(36);
                    io.sockets.emit('receiveRoomMsg', { notice: msg }, msgId, roomNum);
                    await RoomProvider.leaveRoom(roomNum);
                    await RoomProvider.decMember(roomNum);
                    let currentMember = await RoomProvider.getCurrentMember(roomNum);
                    io.sockets.in(`/gameRoom${roomNum}`).emit('leaveRoom');
                    io.sockets.in(`/gameRoom${roomNum}`).emit('ready', nickname, false);
                    await redis.set(`ready${roomNum}`, 0);
                    io.to(`/gameRoom${roomNum}`).emit('userNickname', currentMember);
                }
            }
        } catch (err) {
            socket.emit('error', (err.statusCode ??= 500), err.message);
        }
    });
});
