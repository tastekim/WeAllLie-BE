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

    giveCategory = async (category) => {
        const giveCategory = await Game.find({ category });
        const oneCategory = giveCategory.map((y) => {
            category = y.category;
        });
        return oneCategory;
    };

    //카테고리 & 정답 단어 보여주기
    giveWord = async (categoryFix) => {
        const giveWord = await Game.find({ category: categoryFix });
        return giveWord;
    };

    giveExample = async (categoryFix) => {
        const giveExample = await Game.find({ category: categoryFix });
        return giveExample;
    };

    //발언권 지목하기
    micToss = async (nickname) => {
        const micToss = await User.find(nickname);
        return micToss;
    };
}

module.exports = new GameRepo();
