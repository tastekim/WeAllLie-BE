// const socket = io(); (프론트)
// io => 백엔드 소켓과 자동적으로 연결해주는 함수 (프론트)

//  프론트 app.js
//  const welcome = document.getElementById("welcome");
//  const form = welcome.querySelector("form");

// function create(msg){
//   대충 방 생성하는 함수 -> 프론트에서 실행
//}
// function lobby(msg){
//     대충 로비로 가는 함수
// }
// function enter(msg){
//   대충 방번호 받아서 들어가는 함수
//}
//  function handleRoomSubmit(event){
//     event.preventDefault();
//     const lobby = form.querySelector("lobby") -> 로비로 가는 버튼
//     socket.emit("eneterRoom", lobby) -> 마지막으로 실행시키고 싶은 함수는 arg 마지막에 넣기
//     const input = form.querySelector("input"); -> 방 제목 입력하는 곳
//     socket.emit("createRoom", gameMode, input.value, create) -> input.value == 방 제목
//     socket.emit("enterRoom", roomId, eneter) -> roomId 를 백엔드에게 넘겨주고 나서 enter실행
//  form.addEventListener("submit", handleRoomSubmit);