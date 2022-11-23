const lobby = require('../socket');
const Room = require('../schemas/room');
const redis = require('../redis');

const autoIncrease = function () {
    let a = 1;
    const inner = function () {
        return a++;
    };
    return inner;
};
const autoInc = autoIncrease();

let userCnt = 0;

// 로비에 연결 되었을때
lobby.on('connection', async (socket) => {
    // 닉네임 가져오기
    socket.on('getNickname', (nickname) => {
        socket.nickname = nickname;
        socket.emit('getNickname', socket.nickname);
        console.log(socket.nickname);
    });
    userCnt++;
    console.log(socket.id + ' join lobby !');
    console.log(userCnt);
    const shwRoom = await Room.find({});
    lobby.sockets.emit('showRoom', shwRoom);
    lobby.emit('userCount', userCnt);

    socket.on('disconnect', () => {
        userCnt--;
        console.log(userCnt);
        lobby.emit('userCount', userCnt);
    });

    // 방 조회
    socket.on('showRoom', async () => {
        const shwRoom = await Room.find({});

        lobby.sockets.emit('showRoom', shwRoom);
    });

    // 방 퇴장
    socket.on('leaveRoom', async (roomNum) => {
        await Room.findByIdAndUpdate({ _id: roomNum }, { $inc: { currentCount: -1 } });
        const udtRoom = await Room.findOne({ _id: roomNum });
        let shwRoom = await Room.find({});

        if (udtRoom.currentCount <= 8 && udtRoom.currentCount >= 1) {
            if (udtRoom.roomMaker === socket.nickname) {
                console.log('방장이 퇴장했습니다.');
                lobby.in(`/gameRoom${roomNum}`).socketsLeave(`/gameRoom${roomNum}`);
                socket.leave(`/gameRoom${roomNum}`);
                lobby.sockets.to(`/gameRoom${roomNum}`).emit('leaveRoom', roomNum);
                await Room.deleteOne({ _id: roomNum });
                shwRoom = await Room.find({});
                lobby.sockets.emit('showRoom', shwRoom);
            } else {
                socket.leave(`/gameRoom${roomNum}`);
                socket.emit('leaveRoom', udtRoom);
                lobby.sockets.emit('showRoom', shwRoom);
            }
        } else if (udtRoom.currentCount <= 0) {
            await Room.deleteOne({ _id: roomNum });
            shwRoom = await Room.find({});
            console.log('방이 삭제 되었습니다.');
            socket.emit('leaveRoom');
            lobby.sockets.emit('showRoom', shwRoom);
        }
        console.log(socket.rooms);
        console.log(socket.adapter.rooms);
    });

    // 게임방생성
    socket.on('createRoom', async (gameMode, roomTitle) => {
        let autoNum = autoInc();

        await Room.create({
            _id: autoNum,
            gameMode: gameMode,
            roomTitle: roomTitle,
            roomMaker: socket.nickname,
        });

        const makedRoom = await Room.findOne({ _id: autoNum });
        const shwRoom = await Room.find({});
        redis.set(`ready${autoNum}`, 0);

        socket.join(`/gameRoom${autoNum}`);
        console.log(makedRoom);
        socket.emit('createRoom', makedRoom);
        lobby.sockets.emit('showRoom', shwRoom);
    });

    // 게임방입장
    socket.on('enterRoom', async (roomNum) => {
        const udtRoom = await Room.findOne({ _id: roomNum });

        if (udtRoom.currentCount <= 8) {
            await Room.findByIdAndUpdate({ _id: roomNum }, { $inc: { currentCount: 1 } });

            const currntRoom = await Room.findOne({ _id: roomNum });

            await socket.join(`/gameRoom${roomNum}`);
            console.log(socket.adapter.rooms);
            console.log(currntRoom);
            socket.emit('enterRoom', currntRoom);
        } else if (udtRoom.currentCount > 8) {
            console.log('풀방입니다.');
        }
    });

    // 게임 준비
    socket.on('ready', async (roomNum) => {
        const findRoom = await Room.findOne({ _id: roomNum });
        if (socket.isReady === undefined) {
            socket.isReady = 1;
        } else if (socket.isReady === 0) {
            redis.incr(`ready${roomNum}`);
            console.log('준비 완료 !');
        } else if (socket.isReady === 1) {
            redis.decr(`ready${roomNum}`);
            console.log('준비 취소 !');
        }
        let readyCount = await redis.get(`ready${roomNum}`);
        if (findRoom.currentCount == readyCount && findRoom.currentCount > 3) {
            console.log('게임시작 5초전!');
            setTimeout(async () => {
                console.log('게임 시작 ! ');
                lobby.to(`/gameRoom${roomNum}`).emit('gameStart');
                await Room.findByIdAndUpdate({ _id: roomNum }, { roomStatus: true });
                await redis.del(`ready${roomNum}`);
            }, 5000);
        }
    });
});
