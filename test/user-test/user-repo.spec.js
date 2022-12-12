const User = require('../../src/schemas/user');
const UserRepo = require('../../src/users/user-repo');
const { toSaveInfo, allUserNotLen0 } = require('../mockData/user-data');

describe('UserRepo에 존재하는 함수 확인하기', () => {
    it('UserRepo에 createUser 함수가 존재한다.', () => {
        expect(typeof UserRepo.createUser).toBe('function');
    });
    it('UserRepo에 findAllUser 함수가 존재한다.', () => {
        expect(typeof UserRepo.findAllUser).toBe('function');
    });
    it('UserRepo에 findOneByEmail 함수가 존재한다.', () => {
        expect(typeof UserRepo.findOneByEmail).toBe('function');
    });
    it('UserRepo에 findOneByNickname 함수가 존재한다.', () => {
        expect(typeof UserRepo.findOneByNickname).toBe('function');
    });
    it('UserRepo에 findOneById 함수가 존재한다.', () => {
        expect(typeof UserRepo.findOneById).toBe('function');
    });
    it('UserRepo에 updateNick 함수가 존재한다.', () => {
        expect(typeof UserRepo.updateNick).toBe('function');
    });
});

describe('UserRepo의 함수가 실행될 때 DB 요청이 함수들이 실행되는지 확인하기', () => {
    let mockCreate, mockFindAll, mockFindOne, mockFindId, mockUpdateNick;
    beforeEach(() => {
        jest.resetAllMocks();
        mockCreate = jest.spyOn(User, 'create');
        User.create.mockResolvedValue(allUserNotLen0[0]);
        mockFindAll = jest.spyOn(User, 'find');
        User.find.mockResolvedValue(allUserNotLen0);
        mockFindOne = jest.spyOn(User, 'findOne');
        User.findOne.mockResolvedValue(allUserNotLen0[0]);
        mockFindId = jest.spyOn(User, 'findById');
        User.findById.mockResolvedValue(allUserNotLen0[0]);
        mockUpdateNick = jest.spyOn(User, 'updateOne');

        // UserFunction.getPlayRecord.mockResolvedValue(playRecord);
    });

    it('createUser 함수가 호출되었을 때, 내부에서 User.create 함수가 1회 호출되고, argument로 createUser의 argument가 전달된다.', async () => {
        await UserRepo.createUser(toSaveInfo[0]);
        expect(mockCreate).toBeCalledTimes(1);
        expect(mockCreate.mock.calls[0]).toHaveLength(1);
        expect(mockCreate).toBeCalledWith(toSaveInfo[0]);
    });

    it('findAllUser 함수가 호출되었을 때, 내부에서 User.find 함수가 1회 호출된다.', async () => {
        await UserRepo.findAllUser(toSaveInfo[0]);
        expect(mockFindAll).toBeCalledTimes(1);
    });

    it('findOneByEmail 함수가 호출되었을 때, 내부에서 User.findOne 함수가 1회 호출되고, argument로 createUser의 argument가 객체로 변환되어 전달된다.', async () => {
        const expectedArg = { email: toSaveInfo[0].email };
        await UserRepo.findOneByEmail(toSaveInfo[0].email);

        expect(mockFindOne).toBeCalledTimes(1);
        expect(mockFindOne.mock.calls[0]).toHaveLength(1);
        expect(mockFindOne).toBeCalledWith(expectedArg);
    });

    it('findOneByNickname 함수가 호출되었을 때, 내부에서 User.findOne 함수가 1회 호출되고, argument로 createUser의 argument가 객체로 변환되어 전달된다.', async () => {
        const expectedArg = { nickname: toSaveInfo[0].nickname };
        await UserRepo.findOneByNickname(toSaveInfo[0].nickname);

        expect(mockFindOne).toBeCalledTimes(1);
        expect(mockFindOne.mock.calls[0]).toHaveLength(1);
        expect(mockFindOne).toBeCalledWith(expectedArg);
    });

    it('findOneById 함수가 호출되었을 때, 내부에서 User.findOne 함수가 1회 호출되고, argument로 createUser의 argument가 그대로 전달된다.', async () => {
        await UserRepo.findOneById(toSaveInfo[0]._id);

        expect(mockFindId).toBeCalledTimes(1);
        expect(mockFindId.mock.calls[0]).toHaveLength(1);
        expect(mockFindId).toBeCalledWith(toSaveInfo[0]._id);
    });

    it('updateNick 함수가 호출되었을 때, 내부에서 User.updateOne 함수가 1회 호출되고, argument로 createUser의 argument가 객체로 변환되어 전달된다.', async () => {
        const expectedArg = [{ _id: toSaveInfo[0]._id }, { nickname: toSaveInfo[0].nickname }];
        await UserRepo.updateNick(toSaveInfo[0]._id, toSaveInfo[0].nickname);

        expect(mockUpdateNick).toBeCalledTimes(1);
        expect(mockUpdateNick.mock.calls[0]).toHaveLength(2);
        expect(mockUpdateNick).toBeCalledWith(...expectedArg);
    });
});
