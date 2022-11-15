const lobby = require('../socket');
const Room = require('../schemas/room')
//const jwt = require('jsonwebtoken');

const autoIncrease = function () {
  let a = 1;
  const inner = function () {
  return a++
  }
  return inner
  }
const autoInc = autoIncrease();


// lobby.sockets
// .on("connection", (socket) => {
//     console.log("join lobby")
//   }).on("createRoom", async (gameMode, roomTitle, nickname) =>{ // 방생성

//     let autoNum = autoInc();
    
//     console.log(autoNum)

//     const creRoom =  Room.create({
//         "_id": autoNum,
//         "gameMode": gameMode,
//         "roomTitle": roomTitle,
//         "roomMaker" : nickname,
//       });

//       socket.join(`/gameRoom${autoNum}`)
//       console.log("create room !")
//       console.log(socket.rooms)
//       socket.emit("createRoom",nickname, creRoom);

//   }).on("enterRoom", async (roomNum, nickname) => { // 방 입장
          
//     const entRoom = await Room.findByIdAndUpdate(
//       {_id : roomNum}, 
//       {$inc : {currentCount : 1}}
//       )

//     const udtRoom = await Room.findOne({_id : roomNum})


//     if(udtRoom.currentCount <= 8){
//      console.log(udtRoom)
//       socket.join(`/gameRoom${roomNum}`)
//       console.log(`${nickname} join room ${roomNum}`)
//       socket.emit('enterRoom', udtRoom);
//     }else if(udtRoom.currentCount > 8){
//       console.log("풀방입니다.")
//       console.log(udtRoom)
      
//     }
//   }).on('leaveRoom', async(roomNum, nickname) => {  // 방 퇴장 

//     const lvRoom = await Room.findByIdAndUpdate(
//       {_id : roomNum},
//       {$inc : {currentCount : -1}}
//     )
//     const udtRoom = await Room.findOne({_id : roomNum})

//     if(udtRoom.currentCount <= 8 && udtRoom.currentCount >= 1){
//     console.log(nickname + ' leave room');
//     console.log(udtRoom)
//     socket.leave(`/gameRoom${roomNum}`)
//     console.log(socket.rooms)
//     socket.emit("leaveRoom", udtRoom)
//     }else if(udtRoom.currentCount <= 0){

//       const dteRoom = await Room.deleteOne({_id : roomNum})

//       console.log(udtRoom)
//       console.log("방이 삭제 되었습니다.")
//       socket.leave(`/gameRoom${roomNum}`)
//       socket.emit("leaveRoom", dteRoom)
//     }
//   }).on('ready', (nickname) => {
//     socket.emit('ready', nickname)
//   }).on('gameStart', () => {

//   })



// 로비에 연결 되었을때 
lobby.on('connection',  (socket) => {

    socket.on('getNickname', (nickname) => {
      socket.nickname = nickname
      socket.emit('getNickname', socket.nickname)
      console.log(socket.nickname)
    })
    
    // 게임방생성
     socket.on("createRoom", async (gameMode, roomTitle) => { // roomName 과 gameMode를 받아서 방 생성 함수를 실행

    let autoNum = autoInc();
    

    const creRoom =  await Room.create({
        "_id": autoNum,
        "gameMode": gameMode,
        "roomTitle": roomTitle,
        "roomMaker" : socket.nickname,
      });

      socket.join(`/gameRoom${autoNum}`)
      console.log("create room !")
      console.log(lobby.sockets.adapter.rooms)
      socket.emit("createRoom",socket.nickname, creRoom); 
})

    // 게임방입장
     socket.on('enterRoom', async (roomNum) => {
          
      const entRoom = await Room.findByIdAndUpdate(
        {_id : roomNum}, 
        {$inc : {currentCount : 1}}
        )

      const udtRoom = await Room.findOne({_id : roomNum})


      if(udtRoom.currentCount <= 8){
       console.log(udtRoom)
        socket.join(`/gameRoom${roomNum}`)
        console.log(`${socket.nickname} join room ${roomNum}`)
        console.log(lobby.sockets.adapter.rooms)
        socket.emit('enterRoom', udtRoom);
      }else if(udtRoom.currentCount > 8){
        console.log("풀방입니다.")
        console.log(udtRoom)
        
      }
     


    // 방 퇴장
    socket.on('leaveRoom', async(roomNum) => { 

      const lvRoom = await Room.findByIdAndUpdate(
        {_id : roomNum},
        {$inc : {currentCount : -1}}
      )
      const udtRoom = await Room.findOne({_id : roomNum})

      if(udtRoom.currentCount <= 8 && udtRoom.currentCount >= 1){
      console.log(socket.nickname + ' leave room');
      console.log(udtRoom)
      socket.leave(`/gameRoom${roomNum}`)
      console.log(socket.rooms)
      socket.emit("leaveRoom", udtRoom)
      }else if(udtRoom.currentCount <= 0){

        const dteRoom = await Room.deleteOne({_id : roomNum})

        console.log(udtRoom)
        console.log("방이 삭제 되었습니다.")
        socket.leave(`/gameRoom${roomNum}`)
        socket.emit("leaveRoom", dteRoom)
      }
    });

  //    //게임시작
  //  socket.on('startGame', () => { // 특정 방을 찾아서 startGame이라는 이벤트를 실행
  //   io.of(roomIndex).emit('startGame') 
  // })
  });
})

