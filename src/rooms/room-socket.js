const lobby = require('../socket');
const RoomProvider = require('./room-provider');
const RoomRepo = require('./room-repo');
const GameProvider = require('../game/game-provider');
const redis = require('../redis');
//const { findOne } = require('../schemas/user');

let userCnt = 0;

// 로비에 연결 되었을때
lobby.on('connection', async (socket) => {
    socket.on('disconnect', async () => {
        if (socket.roomNum === undefined || socket.roomNum === null) {
            userCnt--;
            lobby.emit('userCount', userCnt);
        } else {
            console.log('비정상적인 퇴장 발생!');
            await RoomProvider.decMember();
            let currentMember = await RoomProvider.getCurrentMember(socket.roomNum);
            await RoomProvider.leaveRoom(socket.roomNum);
            lobby.to(`/gameRoom${socket.roomNum}`).emit('userNickname', currentMember);
            userCnt--;
            lobby.emit('userCount', userCnt);
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
        socket.isReady = false;
        const createdRoom = await RoomProvider.createRoom(gameMode, roomTitle);
        const showRoom = await RoomProvider.getRoom();
        let currentMember = await RoomProvider.getCurrentMember();
        lobby.sockets.emit('userNickname', currentMember);
        socket.join(`/gameRoom${RoomRepo.createRoom._id}`);
        socket.emit('createRoom', createdRoom);
        lobby.sockets.emit('showRoom', showRoom);
    });

    // 게임방입장
    socket.on('enterRoom', async (roomNum) => {
        const currentCount = await RoomProvider.getCurrentCount(roomNum);
        socket.roomNum = roomNum;
        socket.isReady = false;

        // 방에 들어와있는 인원이 최대 인원 수 보다 적고 roomStatus 가 false 상태일 때 입장 가능.
        if (currentCount <= 8 && RoomProvider.getRoom(roomNum).roomStatus === false) {
            await RoomProvider.enterRoom(roomNum);
            const currentMember = await RoomProvider.getCurrentMember(roomNum);
            const currentRoom = await RoomProvider.getRoom(roomNum);
            await RoomProvider.enterRoom(roomNum);
            await socket.join(`/gameRoom${roomNum}`);
            socket.emit('enterRoom', currentRoom);
            lobby.to(`/gameRoom${socket.roomNum}`).emit('userNickname', currentMember);
        } else if (currentCount > 8) {
            socket.emit('fullRoom');
            console.log('풀방입니다.');
        }
    });

    // 게임 준비
    socket.on('ready', async (roomNum, isReady) => {
        const currentCount = await RoomProvider.getCurrentCount(roomNum);
        const readyStatus = await redis.get(`readyStatus${roomNum}`);
        let readyCount = await RoomProvider.readyCount(roomNum);
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
            console.log('준비 취소 !');
        }
        // 해당하는 방의 setTimeout 의 timer id 값 가져오기.
        if (currentCount === Number(readyCount) && currentCount > 3) {
            await GameProvider.readyStatus(roomNum);
        } else if (readyStatus !== '') {
            await GameProvider.stopGame(roomNum);
        }
    });
});
