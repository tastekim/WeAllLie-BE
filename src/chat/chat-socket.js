const chat = require('../socket');

// 로비에 연결 되었을때
chat.on('connection', async (socket) => {
    // 로비 입장 메세지
    socket.on('enterLobby', (nickname, callback) => {
        console.log(`${nickname} 로비 입장(enterLobby)`);
        const msg = `${nickname} 님이 입장하셨습니다.`;
        const msgId = new Date().getTime().toString(36);
        chat.sockets.emit('receiveLobbyMsg', { notice: msg }, msgId);
        callback();
    });

    // 로비 채팅
    socket.on('sendLobbyMsg', (payload, callback) => {
        console.log('로비채팅(sendLobbyMsg)');
        console.log('payload:::', payload);
        const msgId = new Date().getTime().toString(36);
        chat.sockets.emit('receiveLobbyMsg', payload, msgId);
        callback();
    });

    // 룸 입장 메세지
    socket.on('enterRoomMsg', (roomNum, nickname, callback) => {
        console.log(`${nickname} ${roomNum}번 방 입장(enterRoomMsg)`);
        const msg = `${nickname} 님이 입장하셨습니다.`;
        const msgId = new Date().getTime().toString(36);
<<<<<<< HEAD
        chat.sockets.emit('receiveRoomMsg', { notice: msg }, msgId, roomNum);

=======
        console.log(msg);
        // 방법1
        // socket.to(`/gameRoom${roomNum}`).emit('receiveRoomMsg', { notice: msg }, msgId);
        // 방법2
        // chat.to(`/gameRoom${roomNum}`).emit('receiveRoomMsg', { notice: msg }, msgId);
        // 방법3
        // chat.in(`/gameRoom${roomNum}`).emit('receiveRoomMsg', { notice: msg }, msgId);
        // 방법4
        socket.broadcast.to(`/gameRoom${roomNum}`).emit('receiveRoomMsg', { notice: msg }, msgId);
        // 방법5
        // socket.broadcast.in(`/gameRoom${roomNum}`).emit('receiveRoomMsg', { notice: msg }, msgId);
>>>>>>> parent of e5a3b68 (일단 에러 핸들 각 파일 내에서 처리하도록 변경 / 닉네임변경, 유저 전적조회 api 추가(로컬 테스트 완료))
        callback();
    });

    // 룸 퇴장 메세지 1 - 나가기 버튼 통해 퇴장
    socket.on('leaveRoomMsg', (roomNum, nickname) => {
        console.log(`${nickname} ${roomNum}번 방 퇴장(leaveRoomMsg)`);
        const msg = `${nickname} 님이 퇴장하셨습니다.`;
        const msgId = new Date().getTime().toString(36);
<<<<<<< HEAD
        chat.sockets.emit('receiveRoomMsg', { notice: msg }, msgId, roomNum);
=======
        // 방법1
        // socket.to(`/gameRoom${roomNum}`).emit('receiveRoomMsg', { notice: msg }, msgId);
        // 방법2
        // chat.to(`/gameRoom${roomNum}`).emit('receiveRoomMsg', { notice: msg }, msgId);
        // 방법3
        // chat.in(`/gameRoom${roomNum}`).emit('receiveRoomMsg', { notice: msg }, msgId);
        // 방법4
        socket.broadcast.to(`/gameRoom${roomNum}`).emit('receiveRoomMsg', { notice: msg }, msgId);
        // 방법5
        // socket.broadcast.in(`/gameRoom${roomNum}`).emit('receiveRoomMsg', { notice: msg }, msgId);
>>>>>>> parent of e5a3b68 (일단 에러 핸들 각 파일 내에서 처리하도록 변경 / 닉네임변경, 유저 전적조회 api 추가(로컬 테스트 완료))
    });

    // 룸 채팅
    socket.on('sendRoomMsg', (payload, roomNum, callback) => {
        console.log('룸채팅');
        console.log('payload:::', payload);
        console.log(`roomNum::: ${roomNum}`);
        const msgId = new Date().getTime().toString(36);
<<<<<<< HEAD
        chat.sockets.emit('receiveRoomMsg', payload, msgId, roomNum);
=======
        // 방법1
        // socket.to(`/gameRoom${roomNum}`).emit('receiveRoomMsg', payload, msgId);
        // 방법2
        // chat.to(`/gameRoom${roomNum}`).emit('receiveRoomMsg', payload, msgId);
        // 방법3
        // chat.in(`/gameRoom${roomNum}`).emit('receiveRoomMsg', payload, msgId);
        // 방법4
        socket.broadcast.to(`/gameRoom${roomNum}`).emit('receiveRoomMsg', payload, msgId);
        // 방법5
        // socket.broadcast.in(`/gameRoom${roomNum}`).emit('receiveRoomMsg', payload, msgId);
>>>>>>> parent of e5a3b68 (일단 에러 핸들 각 파일 내에서 처리하도록 변경 / 닉네임변경, 유저 전적조회 api 추가(로컬 테스트 완료))
        callback();
    });
});
