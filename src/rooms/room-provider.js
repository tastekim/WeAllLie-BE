const io = require('../socket');

// 로그인시 소켓에 연결되고 로비로 이동
io.on("connection", (socket) =>{
    console.log("socket server connect") // 로비로 나오면 성공

    // io.to(socket.nickname).emit("lobby") // 닉네임을 가진 사람들에게 로비로 이동하는 함수를 실행
    // io.emit("newConnect") // 로비 채팅방 입장
    
    // socket.on("lobby", (lobby) => {// 로비로 이동
    //     lobby;
    //     socket.emit("lobby", `로비에 입장하였습니다.`, lobby) // 접속한 사람에게 로비로 보내는 함수를 에밋
    // })

    // socket.join(socket.id) // 로비로 이동
    // io.to(socket.id).emit(lobby) // 접속한 사람에게 로비로 보내는 함수를 에밋

    // 방생성
    socket.on("createRoom", (gameMode, roomName, createRoom) => { // roomName 과 gameMode를 받아서 방 생성 함수를 실행
        io.to(socket.nickname).emit(createRoom(gameMode, roomName)); // createRoom 함수는 백엔드에서 실행되는것이 아니라 프론트에서 실행됨
        io.emit("createRoom", `방이 생성 되었습니다.`, createRoom)
    })

    // 방입장
    socket.on("enterRoom", (roomId) =>{
        io.to(socket.nickname).emit(enterRoom(roomId));
        io.emit("enterRoom", enterRoom)
    })

    // 방 퇴장
    socket.on("disconnect", () => { // 방에서 연결 해제 socket.rooms.size === 0
        console.log(socket.nickname, "님이 퇴장하였습니다.")
        io.to(socket.nickname.emit(roomDisconnection))
    })

    
    
})

