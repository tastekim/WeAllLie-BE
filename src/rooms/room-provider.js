const io = require('./socket');

// 로그인시 소켓에 연결되고 로비로 이동
io.on("connection", async (socket) =>{
    console.log(socket.room) // 로비로 나오면 성공
    
    socket.join(socket.id) // 로비로 이동
    io.to(socket.id).emit(lobby) // 접속한 사람에게 로비로 보내는 함수를 에밋

    // 방생성
    socket.on("createRoom", (gameMode, roomName, createRoom) => { // roomName 과 gameMode를 받아서 방 생성 함수를 실행
        createRoom(gameMode, roomName); // createRoom 함수는 백엔드에서 실행되는것이 아니라 프론트에서 실행됨
        socket.emit("createRoom", `방이 생성 되었습니다.`, createRoom)
        console.log(socket.room) // 생성한 방으로 나오면 성공
    })

    // 방입장
    socket.on("enterRoom", (roomId) =>{
        enterRoom(roomId);
        socket.emit("enterRoom", `방에 입장하였습니다.`, enterRoom)
    })

    // 방 퇴장
    socket.on("disconnect", () => { // 방에서 연결 해제 socket.rooms.size === 0

    })

    
    
})

