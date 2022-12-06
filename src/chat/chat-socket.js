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
        console.log(msg);
        // 방법1
        socket.to(`/gameRoom${roomNum}`).emit('receiveRoomMsg', { notice: msg });
        // 방법2
        // chat.to(`/gameRoom${roomNum}`).emit('receiveRoomMsg', { notice: msg });
        // 방법3
        // chat.in(`/gameRoom${roomNum}`).emit('receiveRoomMsg', { notice: msg });
        callback();
    });

    // 룸 퇴장 메세지 1 - 나가기 버튼 통해 퇴장
    socket.on('leaveRoomMsg', (roomNum, nickname) => {
        console.log(`${nickname} ${roomNum}번 방 퇴장`);
        const msg = `${nickname} 님이 퇴장하셨습니다.`;
        // 방법1
        socket.to(`/gameRoom${roomNum}`).emit('receiveRoomMsg', { notice: msg });
        // 방법2
        // chat.to(`/gameRoom${roomNum}`).emit('receiveRoomMsg', { notice: msg });
        // 방법3
        // chat.in(`/gameRoom${roomNum}`).emit('receiveRoomMsg', { notice: msg });
    });

    // 룸 채팅
    socket.on('sendRoomMsg', (payload, roomNum, callback) => {
        console.log('룸채팅');
        console.log('payload:::%o ', payload);
        console.log(`roomNum::: ${roomNum}`);
        // 방법1
        socket.to(`/gameRoom${roomNum}`).emit('receiveRoomMsg', payload);
        // 방법2
        // chat.to(`/gameRoom${roomNum}`).emit('receiveRoomMsg', payload);
        // 방법3
        // chat.in(`/gameRoom${roomNum}`).emit('receiveRoomMsg', payload);
        callback();
    });

    socket.on('enterRoomTest', (roomName) => {
        socket.join(roomName);
        console.log(`${socket.id} join the room ${roomName}`);
    });
});
