const lobby = require('../socket');
const RoomProvider = require('./room-provider');
const RoomRepo = require('./room-repo');
const GameProvider = require('../game/game-provider');
const redis = require('../redis');
//const { findOne } = require('../schemas/user');

// 로비에 연결 되었을때
lobby.on('connection', async (socket) => {
    // 방 퇴장
    socket.on('leaveRoom', async (roomNum) => {
        await RoomProvider.leaveRoom(roomNum);
        const currentCount = await RoomProvider.getCurrentCount(roomNum);
        socket.roomNum = null;
        if (currentCount > 0 && currentCount < 9) {
            const leaveRoom = await RoomProvider.leaveRoom(roomNum);
            socket.emit('leaveRoom', leaveRoom);
        } else if (currentCount <= 0) {
            console.log('방이 삭제 되었습니다.');
            await RoomProvider.deleteRoom(roomNum);
            socket.emit('leaveRoom');
        }
    });

    // 게임방생성
    socket.on('createRoom', async (gameMode, roomTitle) => {
        const roomNum = await RoomProvider.getRoomNum(socket.nickname);
        const createdRoom = await RoomProvider.createRoom(
            gameMode,
            roomTitle,
            socket.nickname,
            roomNum
        );
        await RoomProvider.enterRoom(roomNum);
        socket.roomNum = roomNum;
        socket.isReady = false;
        const showRoom = await RoomProvider.getRoom(roomNum);
        let currentMember = await showRoom.currentCount;
        lobby.sockets.emit('userNickname', currentMember);
        socket.join(`/gameRoom${RoomRepo.createRoom._id}`);
        socket.emit('createRoom', createdRoom);
        lobby.sockets.emit('showRoom', showRoom);
    });

    // 게임방입장
    socket.on('enterRoom', async (roomNum) => {
        const currentCount = await RoomProvider.getCurrentCount(roomNum);
        const roomStatus = await RoomProvider.getRoomStatus(roomNum);
        socket.roomNum = roomNum;
        socket.isReady = false;

        // 방에 들어와있는 인원이 최대 인원 수 보다 적고 roomStatus 가 false 상태일 때 입장 가능.
        if (currentCount < 8 && roomStatus === false) {
            console.log(`${socket.nickname} 님이 ${roomNum} 번 방에 입장하셨습니다`);
            const currentMember = await RoomProvider.getCurrentMember(roomNum);
            const currentRoom = await RoomProvider.getRoom(roomNum);
            await RoomProvider.enterRoom(roomNum);
            await socket.join(`/gameRoom${roomNum}`);
            socket.emit('enterRoom', currentRoom);
            lobby.to(`/gameRoom${socket.roomNum}`).emit('userNickname', currentMember);
        } else if (currentCount >= 8) {
            socket.emit('fullRoom');
            console.log('풀방입니다.');
        }
    });

    // 게임 준비
    socket.on('ready', async (roomNum, isReady) => {
        const currentCount = await RoomProvider.getCurrentCount(roomNum);
        console.log(currentCount);
        const readyStatus = await redis.get(`readyStatus${roomNum}`);
        let readyCount = await RoomProvider.readyCount(roomNum);
        console.log(readyCount);
        if (isReady) {
            // ready 버튼 활성화 시킬 때.
            socket.isReady = 1;
            await RoomProvider.ready(roomNum);
            lobby.sockets.in(`/gameRoom${roomNum}`).emit('ready', socket.nickname, true);
        } else {
            // ready 버튼 비활성화 시킬 때.
            socket.isReady = 0;
            await RoomProvider.unready(roomNum);
            lobby.sockets.in(`/gameRoom${roomNum}`).emit('ready', socket.nickname, false);
        }
        // 해당하는 방의 setTimeout 의 timer id 값 가져오기.
        if (currentCount === Number(readyCount) && currentCount > 3) {
            await GameProvider.readyStatus(roomNum);
        } else if (readyStatus !== '') {
            await GameProvider.stopGame(roomNum);
        }
    });
});
