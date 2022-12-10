//const { findById } = require('../schemas/room');
const Room = require('../schemas/room');
const { Seterror } = require('../middlewares/exception');

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
    createRoom = async (gameMode, roomTitle, nickname) => {
        let autoNum = autoInc();
        const createdRoom = await Room.create({
            _id: autoNum,
            gameMode: gameMode,
            roomTitle: roomTitle,
            roomMaker: nickname,
        });
        return createdRoom;
    };
    // 방 입장
    enterRoom = async (roomNum) => {
        const getRoom = await Room.findById(roomNum);
        await Room.findByIdAndUpdate({ _id: roomNum }, { $inc: { currentCount: 1 } });
        if (!('_id' in getRoom)) {
            throw new Seterror('존재하지 않는 방입니다.', 400);
        }
    };
    // 방 퇴장
    leaveRoom = async (roomNum) => {
        const getRoom = await Room.findById(roomNum);
        await Room.findByIdAndUpdate({ _id: roomNum }, { $inc: { currentCount: -1 } });
        if (!('_id' in getRoom)) {
            throw new Seterror('이미 삭제된 방입니다.', 400);
        }
    };
    // 방 삭제
    deleteRoom = async (roomNum) => {
        const getRoom = await Room.findById(roomNum);
        await Room.deleteOne({ _id: roomNum });
        if (!('_id' in getRoom)) {
            throw new Seterror('이미 삭제된 방입니다.', 400);
        }
    };
    // 방 전체 조회
    getAllRoom = async () => {
        const getAllRoom = await Room.find();
        return getAllRoom;
    };
    // 방 조회
    getRoom = async (roomNum) => {
        const getRoom = await Room.findById(roomNum);
        if (!('_id' in getRoom)) {
            throw new Seterror('존재하지 않는 방입니다.', 400);
        }
        return getRoom;
    };
    // 방 상태 조회
    getRoomStatus = async (roomNum) => {
        const getRoomStatus = await Room.findById(roomNum);
        if (!('_id' in getRoomStatus)) {
            throw new Seterror('존재하지 않는 방입니다.', 400);
        }
        return getRoomStatus.roomStatus;
    };
    // 방 현재 인원 조회
    currentCount = async (roomNum) => {
        const roomData = await Room.findById(roomNum);
        if (!('_id' in roomData)) {
            throw new Seterror('존재하지 않는 방입니다.', 400);
        }
        return roomData.currentCount;
    };
    // 방 상태 ture 전환
    getTrue = async (roomNum) => {
        await Room.findOneAndUpdate({ _id: roomNum }, { roomStatus: true });
    };
}

module.exports = new RoomRepo();
