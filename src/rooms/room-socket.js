const lobby = require('../socket');
const Room = require('../schemas/room')

const autoIncrease = function () {
  let a = 1;
  const inner = function () {
  return a++
  }
  return inner
  }
const autoInc = autoIncrease();



// 로비에 연결 되었을때 
lobby.on('connection',  (socket) => {
  console.log(socket.id + ' join lobby !') 

    // 미들웨어 할 예정
    // lobby.use((socket, next)=>{

    // })

    // 게임방생성
     socket.on("createRoom", async (gameMode, roomTitle) => { // roomName 과 gameMode를 받아서 방 생성 함수를 실행

    let autoNum = autoInc();
    
    console.log(autoNum)

    const rooms =  Room.create({
        "_id": autoNum,
        "gameMode": gameMode,
        "roomTitle": roomTitle 
      });

      socket.join(`/gameRoom${autoNum}`)
      console.log(socket.rooms)
      socket.emit("createRoom", rooms); 
})

    // 게임방입장
     socket.on('enterRoom', (roomNum, nickname) => {
      

      socket.join(`/gameRoom${roomNum}`)
      console.log(`${nickname} join room ${roomNum}`)
      console.log(socket.rooms)
        socket.emit('enterRoom', nickname);

    // 방 퇴장
    socket.on('leaveRoom', (roomNum, nickname) => { 
      console.log(nickname + ' go to lobby');
      socket.leave(`/gameRoom${roomNum}`)
      console.log(socket.rooms)
    });

  //    //게임시작
  //  socket.on('startGame', () => { // 특정 방을 찾아서 startGame이라는 이벤트를 실행
  //   io.of(roomIndex).emit('startGame') 
  // })


  });



})

