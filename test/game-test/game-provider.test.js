const GameProvider = require('../../src/game/game-provider');

const mockGameReopo = () => ({
    getRoomCurrentCount: jest.fn(),
    getSpy: jest.fn(),
    catchSpy: jest.fn(),
    setPlayCount: jest.fn(),
    giveCategory: jest.fn(),
    giveWord: jest.fn(),
});

describe('game-provider test', () => {
    let gameProvider = new GameProvider();
    gameProvider = mockGameReopo();

    beforeEach(() => {
        //gameProvider.gameRepo = Object.assign({}, mockGameReopo);

        jest.resetAllMocks();
    });

    test('getGameRoomUsers의 Test Case', async () => {
        const getGameRoomUsersResult = [];

        gameProvider.gameRepo.getRoomCurrentCount = jest.fn(() => {
            return getGameRoomUsersResult;
        });

        await gameProvider.getGameRoomUsers({
            roomNum: 1,
        });
        expect(gameProvider.gameRepo.getRoomCurrentCount).toHaveBeenCalledTimes(1);
    });

    // test('setPlayCount의 Test Case', async () => {
    //     const setPlayCountResult = [];

    //     gameProvider.gameRepo.setPlayCount = jest.fn(() => {
    //         return setPlayCountResult;
    //     });

    //     await gameProvider.setPlayCount({});
    //     expect(gameProvider.gameRepo.setPlayCount).toHaveBeenCalledTimes(1);
    // });

    //     //     //     test('getSpy', async () => {
    //     //     //         expect(getRoomCurrentCount).toBe('function');
    //     //     //     });

    //     //     //     test('catchSpy', async () => {
    //     //     //         expect(getRoomCurrentCount).toBe('function');
    //     //     //     });

    //     //     //     test('setPlayCount', async () => {
    //     //     //         expect(getRoomCurrentCount).toBe('function');
    //     //     //     });

    //     //     //     test('setVoteResult', async () => {
    //     //     //         expect(getRoomCurrentCount).toBe('function');
    //     //     //     });

    //     //     //     test('getVoteResult', async () => {
    //     //     //         expect(getRoomCurrentCount).toBe('function');
    //     //     //     });

    //     //     //     test('setRoomUsers', async () => {
    //     //     //         expect(getRoomCurrentCount).toBe('function');
    //     //     //     });

    //     //     //     test('setNowVote', async () => {
    //     //     //         expect(getRoomCurrentCount).toBe('function');
    //     //     //     });

    //     //     //     test('nowVote', async () => {
    //     //     //         expect(getRoomCurrentCount).toBe('function');
    //     //     //     });

    //     //     //     test('selectSpy', async () => {
    //     //     //         expect(getRoomCurrentCount).toBe('function');
    //     //     //     });

    //     //     //     test('giveWord', async () => {
    //     //     //         expect(getRoomCurrentCount).toBe('function');
    //     //     //     });
});
