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

    //카테고리 & 정답 단어 보여주기
    giveWord = async (category, word) => {
        return await Game.find(category, word);
    };

    giveExample = async (category) => {
        const giveExample = await Game.find(category);
        return giveExample;
    };

    //발언권 지목
    micToss = async (nickname) => {
        return await User.find(nickname);
    };
}

module.exports = new GameRepo();
