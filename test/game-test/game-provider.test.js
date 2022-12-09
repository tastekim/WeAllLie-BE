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
});
