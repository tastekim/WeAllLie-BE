const RoomRepo = require('./room-repo');
const redis = require('../redis');

class RoomProvider {
    // 현재 인원 조회
    getCurrentCount = async (roomNum) => {
        let currentCount = await RoomRepo.currentCount(roomNum);
        return currentCount;
    };
    // 방 게임 상태 조회
    getRoomStatus = async (roomNum) => {
        const roomStatus = await RoomRepo.getRoomStatus(roomNum);
        return roomStatus;
    };
    // 방 번호 조회
    getRoomNum = async (nickname) => {
        const getRoomNum = await RoomRepo.getRoomNum(nickname);
        return getRoomNum;
    };
    // 현재 인원이 들어있는 redis 배열
    getCurrentMember = async (roomNum) => {
        let currentMember = await redis.lrange(`currentMember${roomNum}`, 0, -1);
        for (; currentMember.length < 8; ) currentMember.push('');
        return currentMember;
    };
    // 입장인원 추가
    incMember = async (roomNum, nickname) => {
        await redis.rpush(`currentMember${roomNum}`, nickname);
        let currentMember = await redis.lrange(`currentMember${roomNum}`, 0, -1);
        return currentMember;
    };
    // 입장인원 제거
    decMember = async (roomNum, nickname) => {
        await redis.lrem(`currentMember${roomNum}`, 1, nickname);
        let currentMember = await redis.lrange(`currentMember${roomNum}`, 0, -1);
        return currentMember;
    };
    // 방 생성
    createRoom = async (gameMode, roomTitle, nickname) => {
        const createRoom = await RoomRepo.createRoom(gameMode, roomTitle, nickname);
        const roomNum = await RoomRepo.getRoomNum(nickname);
        await redis.lpush(`currentMember${await RoomRepo.getRoomNum(nickname)}`, nickname);
        await redis.set(`ready${roomNum}`, 0);
        await redis.set(`readyStatus${await RoomRepo.getRoomNum(nickname)}`, '');
        return createRoom;
    };
    // 방 입장
    enterRoom = async (roomNum) => {
        await RoomRepo.enterRoom(roomNum);
        return;
    };
    // 방 퇴장
    leaveRoom = async (roomNum) => {
        await RoomRepo.leaveRoom(roomNum);
        return;
    };
    // 방 삭제
    deleteRoom = async (roomNum) => {
        await RoomRepo.deleteRoom(roomNum);
        await redis.del(`ready${roomNum}`);
        await redis.del(`readyStatus${roomNum}`);
        await redis.del(`currentMember${roomNum}`);
    };
    // 방 전제 조회
    getAllRoom = async () => {
        return await RoomRepo.getAllRoom();
    };
    // 방 조회
    getRoom = async (roomNum) => {
        return await RoomRepo.getRoom(roomNum);
    };
    // 게임 준비
    ready = async (roomNum, nickname) => {
        // ready 버튼 활성화 시킬 때.
        await redis.incr(`ready${roomNum}`);
        await redis.rpush(`gameRoom${roomNum}Users`, nickname);
        console.log('준비 완료 !');
    };
    // 준비 취소
    unready = async (roomNum, nickname) => {
        // ready 버튼 비활성화 시킬 때.
        await redis.decr(`ready${roomNum}`);
        await redis.lrem(`gameRoom${roomNum}Users`, 1, nickname);
        console.log('준비 취소 !');
    };
    // 준비 조회
    readyCount = async (roomNum) => {
        return await redis.get(`ready${roomNum}`);
    };
    // 게임상태 true로 수정
    getTrue = async (roomNum) => {
        return await RoomRepo.getTrue(roomNum);
    };
}

module.exports = new RoomProvider();
