const io = require('../socket');


// 소켓 연결시 
io.on("connect", (socket) =>{
    // 소켓 연결시에는 provate 룸 밖에 없지만 연결된 각 유저에게 로비 입장하는 함수 에밋 후에 밑의 과정을 실행
    console.log(socket.nickname, "님이 입장하였습니다.")

    io.to(socket.nickname).emit("newConnection", roomId) // roomId에 따라 로비채팅방에 입장할 수도 있고 게임방내 채팅방으로 이동할 수 있음.

    socket.on("disconnect", () => {
        io.emit("newDisconnection", socket.nickname)
    })

    socket.on("sendMessage", (nickname, message) => {
        let msg = nickname + " : " + message
        io.emit("receiveMessage", msg)
    })
    
})