const User = require('../schemas/user');
const Room = require('../schemas/room');
const Game = require('../schemas/game');
const { SetError } = require('../middlewares/exception');

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
        const roomData = await Room.findOne({ _id: roomNum });
        if (!('spyUser' in roomData)) {
            throw new SetError('방 정보가 없습니다.', 400);
        }
        return roomData.spyUser;
    };

    catchSpy = async (nickname) => {
        const userData = await User.findOne({ nickname: nickname });
        if (!('nickname' in userData)) {
            throw new SetError('유저의 정보가 없습니다.', 400);
        }
        await this.Room.findOneAndUpdate({ nickname }, { $inc: { voteCount: 1 } });
    };

    setSpyWinCount = async (nickname) => {
        await this.Room.findOneAndUpdate({ nickname }, { $inc: { spyWinCount: 1 } });
    };

    setPlayCount = async (nickname) => {
        const userData = await this.User.findOne({ nickname: nickname });
        if (!('nickname' in userData)) {
            throw new SetError('유저의 정보가 없습니다.', 400);
        }
        await this.User.findOneAndUpdate({ nickname }, { $inc: { totalPlayCount: 1 } });
    };

    getRoomCurrentCount = async (roomNum) => {
        const roomData = await this.Room.findById(roomNum);
        if (roomData === null) {
            throw new SetError('방 정보가 없습니다.', 400);
        }
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
        const giveWord = await this.Game.find({ category: categoryFix }).limit(20);
        if (giveWord.length !== 20) {
            throw new SetError('게임 진행에 필요한 제시어가 부족합니다.', 500);
        }
        return giveWord.map((y) => y.word);
    };

    setGameWord = async (roomNum, answerWord) => {
        await this.Room.findByIdAndUpdate({ _id: roomNum }, { $set: { gameWord: answerWord } });
    };
}

module.exports = GameRepo;
