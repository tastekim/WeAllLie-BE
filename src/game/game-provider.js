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
}

module.exports = new GameProvider();
