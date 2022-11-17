const chat = require('../socket');
// const ChatProvider = require('./chat-provider');

// 로비에 연결 되었을때
chat.on('connection', async (socket) => {
    console.log(socket.id + ' 여긴 채팅방!!!');
    // 로비 채팅

    // 룸 채팅
    socket.on('sendRoomMsg', async (payload, roomNum, callback) => {
        socket.to(`/gameRoom${roomNum}`).emit('receiveRoomMsg', payload);

        callback();
    });
});
