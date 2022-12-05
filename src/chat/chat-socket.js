const chat = require('../socket');

// 로비에 연결 되었을때
chat.on('connection', async (socket) => {
    // 로비 입장 메세지
    socket.on('enterLobby', (nickname, callback) => {
        console.log(`${nickname} 로비 입장`);
        const msg = `${nickname} 님이 입장하셨습니다.`;
        chat.sockets.emit('receiveLobbyMsg', { notice: msg });
        callback();
    });

    // 로비 채팅
    socket.on('sendLobbyMsg', (payload, callback) => {
        console.log('로비채팅');
        console.log('payload:::', payload);
        chat.sockets.emit('receiveLobbyMsg', payload);
        callback();
    });

    // 룸 입장 메세지
    socket.on('enterRoomMsg', (roomNum, nickname, callback) => {
        console.log(`${nickname} ${roomNum}번 방 입장`);
        const msg = `${nickname} 님이 입장하셨습니다.`;
        socket.to(`/gameRoom${roomNum}`).emit('receiveRoomMsg', { notice: msg });
        callback();
    });

    // 룸 퇴장 메세지 1 - 나가기 버튼 통해 퇴장
    socket.on('leaveRoomMsg', (roomNum, nickname) => {
        console.log(`${nickname} ${roomNum}번 방 퇴장`);
        const msg = `${nickname} 님이 퇴장하셨습니다.`;
        socket.to(`/gameRoom${roomNum}`).emit('receiveRoomMsg', { notice: msg });
    });

    // 룸 퇴장 메세지 2 - 비정상적 연결 해제
    socket.on('disconnecting', () => {
        console.log(`disconnecting 이벤트 발생!! ${socket.id}`);
        console.log('socket.rooms ::', socket.rooms);
        // socket.rooms.size > 1 이라는 것은 public room 에 입장했던 상태라는 것
        // 만약 socket.rooms.size 가 1 이라면 굳이 메세지 이벤트를 발생시키지 않아도 된다.
        if (socket.rooms.size > 1) {
            const nickname = socket.nickname;
            console.log(`${nickname} 방 퇴장`);
            const msg = `${nickname} 님이 퇴장하셨습니다.`;
            socket.to(socket.roomNum).emit('receiveRoomMsg', { notice: msg });
        }
    });

    // 룸 채팅 (아직 미확정)
    socket.on('sendRoomMsg', (payload, roomNum, callback) => {
        console.log('룸채팅');
        console.log('payload:::', payload);
        console.log(`roomNum::: ${roomNum}`);
        socket.to(`/gameRoom${roomNum}`).emit('receiveRoomMsg', payload);
        callback();
    });
});
