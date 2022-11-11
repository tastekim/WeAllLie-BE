const io = require('../socket');
const lobby = io.of('/room/lobby');
const room = io.of('/room/lobby/roomIndex');
const lobbyChat = io.of('/chat/lobby');
const chat = io.of('/chat/lobby/roomIndex');

io.on("connection", async (socket) =>{
    socket.on('disconnect', () => {
        console.log('user disconnected');
      });
    
      // 로비로 이동 
    await socket.once("connection", (socket) => {
        if(socket.rooms.size === 1){ // 소켓 연결 후에는 private 룸 밖에 안가지기 때문에 로비에 접속 안되어있는 상태
             io.to(nickname).join(lobby)
             socket.emit(lobby)
        }
    })

    socket.on('disconnect', () =>{
      
    })

})

// 로비에 연결 되었을때 
lobby.on('connection', async (socket) => {
  console.log('로비에 입장')
  const nickname =   await req.locals.user


    // 게임방생성
    await socket.on("createRoom", (gameMode, roomTitle, createRoom) => { // roomName 과 gameMode를 받아서 방 생성 함수를 실행
     socket.to(socket.nickname).emit(createRoom(gameMode, roomTitle)); // createRoom 함수는 백엔드에서 실행되는것이 아니라 프론트에서 실행됨
      socket.emit("createRoom", createRoom)
})

    // 게임방입장
    await socket.on('enterRoom', (roomIndex) => {
      socket.join(roomIndex, () => {
        console.log(nickname + ' join a ' + roomIndex);
        io.to(roomIndex).emit('enterRoom', nickname);
    });
  });

})

// 게임방에 입장 했을 때
room.io('connection', async(socket) => {
    console.log(nickname + ' join room ' + roomIndex + '!')

     // 방 퇴장
     await socket.on('disconnection', () => { 
      console.log(nickname + ' go to lobby');
      // 게임방을 나간다는것은 로비로 이동한다는 뜻이니까 leave를 안쓰고 로비로 이동하는 것으로 구현하는게 맞는걸까?
      // leave를 쓰면 게임방의 상위 방인 로비로 자동으로 이동 하는걸까?
      io.of(/room/lobby/roomIndex).io.to(nickname).join(lobby)
    });

    //게임시작
    await socket.on('startGame', () => { // 특정 방을 찾아서 startGame이라는 이벤트를 실행
      io.of(/room/lobby/roomIndex).emit('startGame') 
    })

})