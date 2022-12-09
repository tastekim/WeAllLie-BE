const User = require('../schemas/user');
const Room = require('../schemas/room');
const Game = require('../schemas/game');

class GameRepo {
    constructor() {
        this.User = User;
        this.Room = Room;
        this.Game = Game;
    }

    setSpy = async (roomNum, nickname) => {
        await this.Room.findOneAndUpdate({ _id: roomNum }, { $set: { spyUser: nickname } });
    };

    getSpy = async (roomNum) => {
        const roomData = await this.Room.findById(roomNum);
        return roomData.spyUser;
    };

    catchSpy = async (nickname) => {
        await this.Room.findOneAndUpdate({ nickname }, { $inc: { voteCount: 1 } });
        return 'Catch Spy!';
    };

    setPlayCount = async (nickname) => {
        await this.User.findOneAndUpdate({ nickname }, { $inc: { totalPlayCount: 1 } });
    };

    getRoomCurrentCount = async (roomNum) => {
        const roomData = await this.Room.findById(roomNum);
        return roomData.currentCount;
    };

    giveCategory = async () => {
        const giveCategory = await this.Game.find({});
        const oneCategory = giveCategory.map((y) => y.category);
        const list = new Set(oneCategory);
        return Array.from(list);
    };

    //카테고리 & 정답 단어 보여주기
    giveWord = async (categoryFix) => {
        const giveWord = await this.Game.find({ category: categoryFix });
        return giveWord.map((y) => y.word);
    };
}

module.exports = GameRepo;
