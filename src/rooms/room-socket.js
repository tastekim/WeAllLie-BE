const lobby = require('../socket');
const RoomProvider = require('./room-provider');
const RoomRepo = require('./room-repo');
const GameProvider = require('../game/game-provider');
const Room = require('../schemas/room');
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
            await redis.lrem(`currentMember${socket.roomNum}`, 1, socket.nickname);
            let currentMember = await redis.lrange(`currentMember${socket.roomNum}`, 0, -1);
            await Room.findByIdAndUpdate({ _id: socket.roomNum }, { $inc: { currentCount: -1 } });
            lobby.to(`/gameRoom${socket.roomNum}`).emit('userNickname', currentMember);
            userCnt--;
            lobby.emit('userCount', userCnt);
            try {
                if (socket.isReady === 1) {
                    const findRoom = await Room.findOne({ _id: socket.roomNum });
                    await redis.decr(`ready${socket.roomNum}`);
                    await redis.lrem(`gameRoom${socket.roomNum}Users`, 1, socket.nickname);
                    let readyCount = await redis.get(`ready${socket.roomNum}`);
                    const readyStatus = await redis.get(`readyStatus${socket.roomNum}`);
                    if (readyStatus !== '') {
                        clearTimeout(readyStatus);
                        await redis.set(`readyStatus${socket.roomNum}`, '');
                    }
                    if (findRoom.currentCount === Number(readyCount) && findRoom.currentCount > 3) {
                        console.log('게임시작 5초전!');

                        // 특정 방의 timer identifier 를 저장, 나중에 누군가가 ready 가 취소됬을 때 해당하는 timer id 를 찾아서 멈추기 위해.
                        const readyStatus = setTimeout(async () => {
                            console.log('게임 시작 ! ');

                            // 스파이 랜덤 지정 후 게임 시작 전 emit.
                            const spyUser = await GameProvider.selectSpy(socket.roomNum);
                            lobby.sockets.in(`/gameRoom${socket.roomNum}`).emit('spyUser', spyUser);

                            // 카테고리 및 제시어 랜덤 지정 후 게임 시작과 같이 emit.
                            const gameData = await GameProvider.giveWord(socket.roomNum);
                            lobby.sockets
                                .in(`/gameRoom${socket.roomNum}`)
                                .emit('gameStart', gameData);

                            // 게임방 진행 활성화. 다른 유저 입장 제한.
                            await Room.findByIdAndUpdate(
                                { _id: socket.roomNum },
                                { roomStatus: true }
                            );
                            await redis.del(`ready${socket.roomNum}`);
                            await redis.del(`readyStatus${socket.roomNum}`);
                            await redis.del(`currentMember${socket.roomNum}`);
                        }, 5000);

                        // 방의 timer id 저장.
                        await redis.set(`readyStatus${socket.roomNum}`, readyStatus);
                    }
                }
            } catch (err) {
                console.error(err);
            }
        }
    });

    // 방 퇴장
    socket.on('leaveRoom', async (roomNum) => {
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
        let readyCount = await redis.get(`ready${roomNum}`);
        // 해당하는 방의 setTimeout 의 timer id 값 가져오기.
        const readyStatus = await redis.get(`readyStatus${roomNum}`);
        if (currentCount === Number(readyCount) && currentCount > 3) {
            console.log('게임시작 5초전!');

            // 특정 방의 timer identifier 를 저장, 나중에 누군가가 ready 가 취소됬을 때 해당하는 timer id 를 찾아서 멈추기 위해.
            const readyStatus = setTimeout(async () => {
                console.log('게임 시작 ! ');

                // 스파이 랜덤 지정 후 게임 시작 전 emit.
                const spyUser = await GameProvider.selectSpy(roomNum);
                lobby.sockets.in(`/gameRoom${roomNum}`).emit('spyUser', spyUser);

                // 카테고리 및 제시어 랜덤 지정 후 게임 시작과 같이 emit.
                const gameData = await GameProvider.giveWord(roomNum);
                lobby.sockets.in(`/gameRoom${roomNum}`).emit('gameStart', gameData);

                // 게임방 진행 활성화. 다른 유저 입장 제한.
                await Room.findByIdAndUpdate({ _id: roomNum }, { roomStatus: true });
                await redis.del(`ready${roomNum}`);
                await redis.del(`readyStatus${roomNum}`);
                await redis.del(`currentMember${roomNum}`);
            }, 5000);

            // 방의 timer id 저장.
            await redis.set(`readyStatus${roomNum}`, readyStatus);
        } else if (readyStatus !== '') {
            // setTimeout 이 실행된 후 누군가 ready 를 취소했을 때 그 방의 setTimeout 정지시키기.
            clearTimeout(readyStatus);
            await redis.set(`readyStatus${roomNum}`, '');
        }
    });
});
