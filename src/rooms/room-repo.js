//const { findById } = require('../schemas/room');
const Room = require('../schemas/room');
const socket = require('../socket');

const autoIncrease = function () {
    let a = 1;
    const inner = function () {
        return a++;
    };
    return inner;
};
const autoInc = autoIncrease();

class RoomRepo {
    // 방 생성
    createRoom = async (gameMode, roomTitle) => {
        let autoNum = autoInc();
        await Room.create({
            _id: autoNum,
            gameMode: gameMode,
            roomTitle: roomTitle,
            roomMaker: socket.nickname,
        });
    };
    // 방 입장
    enterRoom = async (roomNum) => {
        await Room.findByIdAndUpdate({ _id: roomNum }, { $inc: { currentCount: 1 } });
    };
    // 방 퇴장
    leaveRoom = async (roomNum) => {
        await Room.findByIdAndUpdate({ _id: roomNum }, { $inc: { currentCount: -1 } });
    };
    // 방 삭제
    deleteRoom = async (roomNum) => {
        await Room.deleteOne({ _id: roomNum });
    };
    // 방 전체 조회
    getAllRoom = async () => {
        const getAllRoom = await Room.find();
        return getAllRoom;
    };
    // 방 조회
    getRoom = async (roomNum) => {
        const getRoom = await Room.findById(roomNum);
        return getRoom;
    };
    // 방 현재 인원 조회
    currentCount = async (roomNum) => {
        const roomData = await Room.findById(roomNum);
        return roomData.currentCount;
    };
}

module.exports = new RoomRepo();
