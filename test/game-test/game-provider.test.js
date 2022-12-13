const GameProvider = require('../../src/game/game-provider');

const mockGameRepo = () => ({
    getRoomCurrentCount: jest.fn(),
    getSpy: jest.fn(),
    catchSpy: jest.fn(),
    setPlayCount: jest.fn(),
    giveCategory: jest.fn(),
    giveWord: jest.fn(),
});

// const mockRoomRepo = () => ({
//     currentCount: jest.fn(),
// });

describe('game-provider test', () => {
    let gameProvider = new GameProvider();
    gameProvider.GameRepo = mockGameRepo();
    //gameProvider.RoomRepo = mockRoomRepo();

    beforeEach(() => {
        //gameProvider.gameRepo = Object.assign({}, mockGameRepo);
        // 모든 Mock을 초기화
        jest.resetAllMocks();
    });

    test('getGameRoomUsers의 Test Case', async () => {
        const getGameRoomUsersResult = {
            roomNum: 1,
        };

        gameProvider.gameRepo.getRoomCurrentCount = jest.fn(() => {
            return getGameRoomUsersResult;
        });

        await gameProvider.getGameRoomUsers({
            getGameRoomUsersResult,
        });
        expect(gameProvider.gameRepo.getRoomCurrentCount).toHaveBeenCalledTimes(1);
    });
});
