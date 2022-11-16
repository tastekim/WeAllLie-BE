const User = require('../schemas/user');
const Room = require('../schemas/room');
const Game = require('../schemas/game');

class GameRepo {
    getSpy = async (roomNum) => {
        const roomData = await Room.findById({ _id: roomNum });
        return roomData.spyUser;
    };

    catchSpy = async (nickname) => {
        await Room.findOneAndUpdate({ nickname }, { $inc: { voteCount: 1 } });
        return 'Catch Spy!';
    };

    setPlayCount = async (nickname) => {
        await User.findOneAndUpdate({ nickname }, { $inc: { totalPlayCount: 1 } });
    };

    getRoomCurrentCount = async (roomNum) => {
        const roomData = await Room.findById({ _id: roomNum });
        return roomData.currentCount;
    };

    //스파이 선택
    selectSpy = async (nickname) => {
        return await User.find(nickname);
    };

    //스파이 저장 -> db room에 저장
    // isSpy = (spyUser) => {};

    //정답 단어 보여주기 //if스파이면 단어랑 카테고리 안보여주기
    giveWord = async (word) => {
        return await Game.find(word);
    };

    //카테고리 & 단어 막무가내로 보여주기
    giveExample = async (category, word) => {
        return await Game.find(category, word);
    };

    //발언권 지목
    micToss = async (nickname) => {
        return await User.find(nickname);
    };
}

module.exports = new GameRepo();
