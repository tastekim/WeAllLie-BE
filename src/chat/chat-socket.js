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
        console.log(`${nickname} 방 입장`);
        const msg = `${nickname} 님이 입장하셨습니다.`;
        socket.to(`/gameRoom${roomNum}`).emit('receiveRoomMsg', { notice: msg });
        callback();
    });

    // 룸 퇴장 메세지 1 - 나가기 버튼 통해 퇴장
    socket.on('leaveRoomMsg', (roomNum, nickname) => {
        console.log(`${nickname} ${roomNum}번 방 퇴장(leaveRoomMsg)`);
        const msg = `${nickname} 님이 퇴장하셨습니다.`;
        const msgId = new Date().getTime().toString(36);
        chat.sockets.emit('receiveRoomMsg', { notice: msg }, msgId, roomNum);
    });

    // 룸 채팅
    socket.on('sendRoomMsg', (payload, roomNum, callback) => {
        console.log('룸채팅');
        console.log('payload:::', payload);
        console.log(`roomNum::: ${roomNum}`);
        const msgId = new Date().getTime().toString(36);
        chat.sockets.emit('receiveRoomMsg', payload, msgId, roomNum);
        callback();
    });
});
