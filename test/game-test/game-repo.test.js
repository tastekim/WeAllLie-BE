const GameRepo = require('../../src/game/game-repo');

const mockUserSchemas = () => ({
    findOneAndUpdate: jest.fn(),
});

const mockRoomSchemas = () => ({
    findOneAndUpdate: jest.fn(),
    findById: jest.fn(),
});

const mockGameSchemas = () => ({
    find: jest.fn(),
});

describe('game-repo test', () => {
    let gameRepo = new GameRepo();

    gameRepo.User = mockUserSchemas();
    gameRepo.Room = mockRoomSchemas();
    gameRepo.Game = mockGameSchemas();

    beforeEach(() => {
        // 모든 Mock을 초기화
        jest.resetAllMocks();
    });

    test('setPlayCount Method의 Test Case', async () => {
        const setPlayCountResult = [];

        gameRepo.User.findOneAndUpdate = jest.fn(() => {
            return setPlayCountResult;
        });

        await gameRepo.setPlayCount({});
        expect(gameRepo.User.findOneAndUpdate).toHaveBeenCalledTimes(1);
    });

    test('setSpy Method의 Test Case', async () => {
        const setSpyResult = [];

        gameRepo.Room.findOneAndUpdate = jest.fn(() => {
            return setSpyResult;
        });

        await gameRepo.setSpy({});
        //findOneAndUpdate을 몇번 실행 ?
        expect(gameRepo.Room.findOneAndUpdate).toHaveBeenCalledTimes(1);
    });

    test('getSpy Method의 Test Case', async () => {
        const getSpyResult = [];

        gameRepo.Room.findById = jest.fn(() => {
            return getSpyResult;
        });

        const roomData = await gameRepo.getSpy({});
        expect(gameRepo.Room.findById).toHaveBeenCalledTimes(1);
        //return 값과 같은지 확인
        expect(roomData).toEqual(getSpyResult.setSpyResult);
    });

    test('catchSpy Method의 Test Case', async () => {
        const catchSpyResult = [];

        gameRepo.Room.findOneAndUpdate = jest.fn(() => {
            return catchSpyResult;
        });
        await gameRepo.catchSpy({});
        expect(gameRepo.Room.findOneAndUpdate).toHaveBeenCalledTimes(1);
    });

    test('getRoomCurrentCount Method의 Test Case', async () => {
        const getRoomResult = [];

        gameRepo.Room.findById = jest.fn(() => {
            return getRoomResult;
        });

        const roomData = await gameRepo.getRoomCurrentCount({});
        expect(gameRepo.Room.findById).toHaveBeenCalledTimes(1);
        expect(roomData).toEqual(getRoomResult.currentCount);
    });

    //더 찾아보기
    test('giveCategory Method의 Test Case', async () => {
        const giveCategoryResult = [];

        gameRepo.Game.find = jest.fn(() => {
            return giveCategoryResult;
        });

        const giveCategory = await gameRepo.giveCategory({});
        expect(gameRepo.Game.find).toHaveBeenCalledTimes(1);
        //expect(giveCategory).toEqual(giveCategoryResult.list);
    });

    test('giveWord Method의 Test Case', async () => {
        const giveWordResult = [];

        gameRepo.Game.find = jest.fn(() => {
            return giveWordResult;
        });

        const giveWord = await gameRepo.giveWord({});
        expect(gameRepo.Game.find).toHaveBeenCalledTimes(1);
        //expect(giveWord).toEqual(giveWordResult.map);
    });
});
