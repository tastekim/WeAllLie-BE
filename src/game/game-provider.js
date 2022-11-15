const GameRepo = require('./game-repo');
const redisCli = require('../redis');

class GameProvider {
    // gameRepo = new GameRepo();

    getSpy = async (roomNum) => {
        return await GameRepo.getSpy(roomNum);
    };

    catchSpy = async (nickname) => {
        return await GameRepo.catchSpy(nickname);
    };

    setPlayCount = async (nickname) => {
        await GameRepo.setPlayCount(nickname);
    };

    setVoteResult = async (roomNum, nickname) => {
        await redisCli.set(`gameRoom${roomNum}Result`, [])
        await redisCli.rpush(`gameRoom${roomNum}Result`, nickname)
    }

    getResult = async (roomNum) => {
        const resultList = await redisCli.get(`gameRoom${roomNum}Result`)
        for (let item of resultList) {

        }
    }
}

module.exports = new GameProvider();