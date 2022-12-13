const GameRepo = require('../../src/game/game-repo');
const { SetError } = require('../../src/middlewares/exception');
const {
    createResult,
    createResultSchema,
    createUserResultSchema,
} = require('../mockData/GameFuntionData');

const mockUserSchemas = () => ({
    findOne: jest.fn(),
});

const mockRoomSchemas = () => ({
    findOneAndUpdate: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
});

const mockGameSchemas = () => ({
    find: jest.fn(),
});

describe('game-repo test', () => {
    this.gameRepo = new GameRepo();
    gameRepo.User = mockUserSchemas();
    this.gameRepo.Room = mockRoomSchemas();
    gameRepo.Game = mockGameSchemas();

    beforeEach(() => {
        // 모든 Mock을 초기화
        jest.resetAllMocks();
    });

    test('setSpy Method의 Test Case', async () => {
        const setSpyResult = { createResult };
        const setSpyResultSchema = { createResultSchema };
        this.gameRepo.Room.findOneAndUpdate = jest.fn(() => {
            return setSpyResultSchema;
        });
        await this.gameRepo.setSpy({ setSpyResult });
        //findOneAndUpdate을 몇번 실행 ?
        expect(this.gameRepo.Room.findOneAndUpdate).toHaveBeenCalledTimes(1);
    });

    test('getSpy Method의 Fail Test Case', async () => {
        gameRepo.Room.findOne = jest.fn(() => {
            return {
                spyUser: createResult.spyUser,
            };
        });
        try {
            await gameRepo.Room.findOne({ createResult });
        } catch (error) {
            expect(error.message).toEqual('방 정보가 없습니다.', 400);
            expect(error).toBeInsranceOf(SetError);
            expect(gameRepo.Room.findOne).toHaveBeenCalledTimes(0);
        }
    });

    test('catchSpy Method의 Fail Test Case', async () => {
        gameRepo.User.findOne = jest.fn(() => {
            return;
        });
        try {
            await gameRepo.User.findOne({ createUserResultSchema });
        } catch (error) {
            expect(error.message).toEqual('유저의 정보가 없습니다.', 400);
            expect(error).toBeInsranceOf(SetError);
            expect(gameRepo.User.findOne).toHaveBeenCalledTimes(0);
        }
    });

    test('setSpy Method의 Test Case', async () => {
        const setSpyResult = { createResult };
        const setSpyResultSchema = { createResultSchema };
        gameRepo.Room.findOneAndUpdate = jest.fn(() => {
            return setSpyResultSchema;
        });
        await gameRepo.setSpy({ setSpyResult });
        //findOneAndUpdate을 몇번 실행 ?
        expect(gameRepo.Room.findOneAndUpdate).toHaveBeenCalledTimes(1);
    });

    test('setSpyWinCount Method의 Test Case', async () => {
        const setSpyWinCountResult = [];

        gameRepo.Room.findOneAndUpdate = jest.fn(() => {
            return setSpyWinCountResult;
        });

        await gameRepo.setSpyWinCount({});

        expect(gameRepo.Room.findOneAndUpdate).toHaveBeenCalledTimes(1);
    });

    test('setPlayCount Method의 Fail Test Case', async () => {
        gameRepo.User.findOne = jest.fn(() => {
            return;
        });
        try {
            await gameRepo.User.findOne({ createUserResultSchema });
        } catch (error) {
            expect(error.message).toEqual('유저의 정보가 없습니다.', 400);
            expect(error).toBeInsranceOf(SetError);
            expect(gameRepo.User.findOne).toHaveBeenCalledTimes(0);
        }
    });

    test('getRoomCurrentCount Method의 Test Case', async () => {
        const getRoomResult = {
            roomNum: 1,
        };

        const getRoomResultSchema = {
            roomNum: 1,
        };

        gameRepo.Room.findById = jest.fn(() => {
            return getRoomResultSchema;
        });

        const roomData = await gameRepo.getRoomCurrentCount({ getRoomResult });

        expect(roomData).toEqual(getRoomResult.currentCount);
        expect(gameRepo.Room.findById).toHaveBeenCalledTimes(1);
    });

    test('giveCategory Method의 Test Case', async () => {
        const giveCategoryResult = [];

        gameRepo.Game.find = jest.fn(() => {
            return giveCategoryResult;
        });

        const giveCategory = await gameRepo.giveCategory({});
        expect(gameRepo.Game.find).toHaveBeenCalledTimes(1);
        const oneCategory = giveCategory.map((y) => y.category);
        const list = new Set(oneCategory);
        expect(giveCategory).toEqual(Array.from(list));
    });

    test('giveWord Method의 Fail Test Case', async () => {
        gameRepo.Game.find = jest.fn(() => {
            return;
        });

        try {
            await gameRepo.Game.find({
                category: '나라',
                word: '대한민국',
            });
        } catch (error) {
            expect(error.message).toEqual('게임 진행에 필요한 제시어가 부족합니다.', 500);
            expect(error).toBeInsranceOf(SetError);
            expect(gameRepo.Game.find).toHaveBeenCalledTimes(0);
        }
    });

    test('setGameWord Method의 Test Case', async () => {
        const setGameWordResult = {
            _id: 1,
            gameWord: '대한민국',
        };
        const setGameWordResultSchema = createResultSchema;
        gameRepo.Room.findByIdAndUpdate = jest.fn(() => {
            return setGameWordResultSchema;
        });
        await gameRepo.setGameWord({ setGameWordResult });
        expect(gameRepo.Room.findByIdAndUpdate).toHaveBeenCalledTimes(1);
    });
});
