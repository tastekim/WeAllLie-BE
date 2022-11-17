const lobby = require('../socket');
const Room = require('../schemas/room');
const redis = require('../redis');
const io = require('../socket');

const autoIncrease = function () {
    let a = 1;
    const inner = function () {
        return a++;
    };
    return inner;
};
const autoInc = autoIncrease();

// 로비에 연결 되었을때
lobby.on('connection', async (socket) => {
    console.log(socket.id + ' join lobby !');
    const shwRoom = await Room.find({});

    // socket.emit('showRoom', shwRoom);

    // 방 조회
    socket.on('showRoom', async () => {
        socket.emit('showRoom', shwRoom);
    });

    socket.on('getNickname', (nickname) => {
        socket.nickname = nickname;
        socket.emit('getNickname', socket.nickname);
        console.log(socket.nickname);
    });

    // 방 퇴장
    socket.on('leaveRoom', async (roomNum) => {
        await Room.findByIdAndUpdate({ _id: roomNum }, { $inc: { currentCount: -1 } });
        const udtRoom = await Room.findOne({ _id: roomNum });

        if (udtRoom.currentCount <= 8 && udtRoom.currentCount >= 1) {
            socket.leave(`/gameRoom${roomNum}`);
            socket.emit('leaveRoom', udtRoom);
            socket.emit('showRoom', shwRoom);
        } else if (udtRoom.currentCount <= 0) {
            const dteRoom = await Room.deleteOne({ _id: roomNum });

            console.log('방이 삭제 되었습니다.');
            socket.emit('leaveRoom', dteRoom);
            socket.emit('showRoom', shwRoom);
        }
    });

    // 게임방생성
    socket.on('createRoom', async (gameMode, roomTitle) => {
        // roomName 과 gameMode를 받아서 방 생성 함수를 실행

        let autoNum = autoInc();

        await Room.create({
            _id: autoNum,
            gameMode: gameMode,
            roomTitle: roomTitle,
            roomMaker: socket.nickname,
        });

        const makedRoom = await Room.findOne({ _id: autoNum });
        redis.set(`ready${autoNum}`, 1);

        socket.join(`/gameRoom${autoNum}`);
        console.log(makedRoom);
        socket.emit('createRoom', makedRoom);
        socket.emit('showRoom', shwRoom);
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
        let readyCount = await redis.get(`ready${roomNum}`);
        const findRoom = await Room.findOne({ _id: roomNum });
        await redis.incr(`ready${roomNum}`);
        console.log('준비 완료 !');
        console.log(readyCount, findRoom.currentCount);
        console.log('게임시작 5초전!');
        setTimeout(async () => {
            if (findRoom.currentCount == readyCount) {
                console.log('게임 시작 ! ');
                lobby.to(`/gameRoom${roomNum}`).emit('gameStart');
                await Room.findByIdAndUpdate({ _id: roomNum }, { roomStatus: true });
                await redis.del(`ready${roomNum}`);
            }
        }, 5000);
    });

    // 준비 취소
    socket.on('unReady', async () => {
        await redis.decr(`ready${roomNum}`);
        console.log('준비 취소 !');
    });

    socket.on('test', async () => {
        const allSocket = await io.sockets.client();
        console.log(allSocket);
    });
});
