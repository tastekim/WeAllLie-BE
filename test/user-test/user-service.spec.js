const UserService = require('../../src/users/user-service');
const UserRepo = require('../../src/users/user-repo');
const UserFunction = require('../../src/users/util/user-function');
const jwtService = require('../../src/users/util/jwt');
const { UserError } = require('../../src/middlewares/exception');
const {
    kakaoUserWithImg,
    allUserNotLen0,
    toSaveInfo,
    playRecord,
    toSendInfo,
} = require('../mockData/user-data');

beforeEach(() => {
    jest.resetAllMocks();
});

// 인가코드로 카카오 토큰 받아오기
describe('getKakaoToken', () => {
    it('UserService 에  getKaKaoToken function 이 존재한다', () => {
        expect(typeof UserService.getKakaoToken).toBe('function');
    });

    // Axios...?
});

// 로그인 시 프론트로 전달할 정보
describe('getLoginInfo', () => {
    it('UserService 에  getLoginInfo function 이 존재한다', () => {
        expect(typeof UserService.getLoginInfo).toBe('function');
    });

    // Axios...?
});

// 유저 정보 조회
describe('getUserRecord', () => {
    let mockFindOne, mockGetPlayRecord;
    beforeEach(() => {
        mockFindOne = jest.spyOn(UserRepo, 'findOneById');
        UserRepo.findOneById.mockResolvedValue(allUserNotLen0[4]);
        mockGetPlayRecord = jest.spyOn(UserFunction, 'getPlayRecord');
        UserFunction.getPlayRecord.mockResolvedValue(playRecord);
    });

    it('UserService 에  getUserRecord function 이 존재한다', () => {
        expect(typeof UserService.getUserRecord).toBe('function');
    });

    it('getUserRecord 함수가 리턴하는 객체는 userId, nickname, profileImg, totalPlayCount, spyPlayCount, ctzPlayCount, spyWinRating, voteSpyRating, accessToken 프로퍼티를 가지고 있다.', async () => {
        const expected = [
            'userId',
            'nickname',
            'profileImg',
            'totalPlayCount',
            'spyPlayCount',
            'ctzPlayCount',
            'spyWinRating',
            'voteSpyRating',
        ];

        const result = await UserService.getUserRecord(allUserNotLen0[4]._id);
        expect(result.hasOwnProperty(...expected)).toBeTruthy();
    });

    it('updateNick 함수가 호출되었을 때, 내부에서 UserRepo.findOneById 함수가 1회 호출되고, 전달된 argument는 1개이다.', async () => {
        await UserService.getUserRecord(allUserNotLen0[4]._id);

        expect(mockFindOne).toBeCalledTimes(1);
        expect(mockFindOne.mock.calls[0].length).toBe(1);
    });

    it('getExUserInfo 함수가 호출될 때, UserFunction.getPlayRecord 함수가 1번 호출되고, 전달된 argument는 1개이다..', async () => {
        await UserService.getExUserInfo(allUserNotLen0[1]);
        expect(mockGetPlayRecord).toBeCalledTimes(1);
        expect(mockGetPlayRecord.mock.calls[0].length).toBe(1);
    });
});

// 유저 닉네임 수정
describe('updateNick', () => {
    let mockFindOneByNickname, mockRepoUpdateNick;
    beforeEach(() => {
        mockFindOneByNickname = jest.spyOn(UserRepo, 'findOneByNickname');
        UserRepo.findOneByNickname.mockResolvedValue(null);
        mockRepoUpdateNick = jest.spyOn(UserRepo, 'updateNick');
    });

    it('UserService 에  updateNick function 이 존재한다', () => {
        expect(typeof UserService.updateNick).toBe('function');
    });

    it('updateNick 함수가 호출되었을 때, 내부에서 UserRepo.findOneByNickname 함수가 1회 호출된다.', () => {
        UserService.updateNick(allUserNotLen0[1]._id, allUserNotLen0[1].nickname);
        expect(mockFindOneByNickname).toBeCalledTimes(1);
    });

    it('UserRepo.findOneByNickname 함수에 전달된 argument는 1개이다.', () => {
        UserService.updateNick(allUserNotLen0[1]._id, allUserNotLen0[1].nickname);
        expect(mockFindOneByNickname.mock.calls[0].length).toBe(1);
    });

    it('UserRepo.findOneByNickname 함수에 전달된 argument 값은 updateNick의 두 번째 argument이다.', () => {
        UserService.updateNick(allUserNotLen0[1]._id, allUserNotLen0[1].nickname);
        expect(mockFindOneByNickname).toBeCalledWith(allUserNotLen0[1].nickname);
    });

    it('동일한 닉네임이 있을 경우 UserError("닉네임 중복", 400) 가 발생한다.', async () => {
        await expect(async () => {
            UserRepo.findOneByNickname.mockResolvedValue('not null');
            await UserService.updateNick(allUserNotLen0[1]._id, allUserNotLen0[1].nickname);
        }).rejects.toThrowError(new UserError('닉네임 중복', 400));
    });

    it('동일한 닉네임이 없다면 UserRepo.updateNick 함수가 1회 호출된다.', async () => {
        await UserService.updateNick(allUserNotLen0[1]._id, allUserNotLen0[1].nickname);
        expect(mockRepoUpdateNick).toBeCalledTimes(1);
    });

    it('UserRepo.updateNick 함수가 호출되었을 때, 전달된 argument는 2개이고, 그 값은 UserService.updateNick에 전달된 argument와 동일하다.', async () => {
        await UserService.updateNick(allUserNotLen0[1]._id, allUserNotLen0[1].nickname);
        const expectedArg = [allUserNotLen0[1]._id, allUserNotLen0[1].nickname];
        expect(mockRepoUpdateNick.mock.calls[0].length).toBe(2);
        expect(mockRepoUpdateNick).toBeCalledWith(...expectedArg);
    });
});

// 가입된 유저에 대해 토큰 발급 & 프론트에 보낼 정보로 가공
describe('getExUserInfo', () => {
    let mockCreateAccessToken, mockGetPlayRecord;

    beforeEach(() => {
        mockCreateAccessToken = jest.spyOn(jwtService, 'createAccessToken');
        jwtService.createAccessToken.mockResolvedValue('이건 토큰');
        mockGetPlayRecord = jest.spyOn(UserFunction, 'getPlayRecord');
        UserFunction.getPlayRecord.mockResolvedValue(playRecord);
    });

    it('UserService 에  getExUserInfo function 이 존재한다', () => {
        expect(typeof UserService.getExUserInfo).toBe('function');
    });

    it('getExUserInfo 함수가 리턴하는 객체는 userId, nickname, profileImg, totalPlayCount, spyPlayCount, ctzPlayCount, spyWinRating, voteSpyRating, accessToken 프로퍼티를 가지고 있다.', async () => {
        const expected = [
            'userId',
            'nickname',
            'profileImg',
            'totalPlayCount',
            'spyPlayCount',
            'ctzPlayCount',
            'spyWinRating',
            'voteSpyRating',
            'accessToken',
        ];

        const result = await UserService.getExUserInfo(allUserNotLen0[1]);
        expect(result.hasOwnProperty(...expected)).toBeTruthy();
    });

    it('getExUserInfo 함수가 호출될 때, jwtService.createAccessToken 함수가 1번 호출된다.', async () => {
        await UserService.getExUserInfo(allUserNotLen0[1]);
        expect(mockCreateAccessToken).toBeCalledTimes(1);
    });

    it('jwtService.createAccessToken 함수에 전달된 argment는 1개이고, 그 값은 getExUserInfo함수 argument의 "_id" 프로퍼티 값이다.', async () => {
        await UserService.getExUserInfo(allUserNotLen0[1]);
        const expectedArg = allUserNotLen0[1]._id;
        expect(mockCreateAccessToken.mock.calls[0].length).toBe(1);
        expect(mockCreateAccessToken).toBeCalledWith(expectedArg);
    });

    it('getExUserInfo 함수가 호출될 때, UserFunction.getPlayRecord 함수가 1번 호출된다.', async () => {
        await UserService.getExUserInfo(allUserNotLen0[1]);
        expect(mockGetPlayRecord).toBeCalledTimes(1);
    });

    it('UserFunction.getPlayRecord 함수에 전달된 argment는 1개이고, 그 값은 getExUserInfo 함수의 argument 값이다.', async () => {
        await UserService.getExUserInfo(allUserNotLen0[1]);
        const expectedArg = allUserNotLen0[1];
        expect(mockGetPlayRecord.mock.calls[0].length).toBe(1);
        expect(mockGetPlayRecord).toBeCalledWith(expectedArg);
    });
});

// 신규 유저 생성, DB 저장, 프론트에 보낼 정보로 가공
describe('createUserToken', () => {
    let mockFindAllUser, mockGetNewUser, mockCreateUser, mockCreateAccessToken, mockGetPlayRecord;

    beforeEach(() => {
        mockFindAllUser = jest.spyOn(UserRepo, 'findAllUser');
        UserRepo.findAllUser.mockResolvedValue(allUserNotLen0);
        mockGetNewUser = jest.spyOn(UserFunction, 'getNewUser');
        UserFunction.getNewUser.mockResolvedValue(toSaveInfo[0]);
        mockCreateUser = jest.spyOn(UserRepo, 'createUser');
        UserRepo.createUser.mockResolvedValue(allUserNotLen0[0]);
        mockCreateAccessToken = jest.spyOn(jwtService, 'createAccessToken');
        jwtService.createAccessToken.mockResolvedValue('이건 토큰');
        mockGetPlayRecord = jest.spyOn(UserFunction, 'getPlayRecord');
        UserFunction.getPlayRecord.mockResolvedValue(playRecord);
    });

    it('UserService 에  createUserToken function 이 존재한다', () => {
        expect(typeof UserService.createUserToken).toBe('function');
    });

    it('createUserToken 함수가 리턴하는 객체는 userId, nickname, profileImg, totalPlayCount, spyPlayCount, ctzPlayCount, spyWinRating, voteSpyRating, accessToken 프로퍼티를 가지고 있다.', async () => {
        const expected = [
            'userId',
            'nickname',
            'profileImg',
            'totalPlayCount',
            'spyPlayCount',
            'ctzPlayCount',
            'spyWinRating',
            'voteSpyRating',
            'accessToken',
        ];

        const result = await UserService.createUserToken('kakaoUserInfo');
        expect(result.hasOwnProperty(...expected)).toBeTruthy();
    });

    it('createUserToken 함수가 호출될 때, UserRepo.findAllUser 함수가 1번 호출되며, 이 때 전달된 argument는 없다.', async () => {
        await UserService.createUserToken(kakaoUserWithImg);

        expect(mockFindAllUser).toBeCalledTimes(1);
        expect(mockFindAllUser.mock.calls[0].length).toBe(0);
    });

    it('createUserToken 함수가 호출될 때, UserFunction.getNewUser 함수가 1번 호출되며, 이 때 전달된 argment는 2개이다.', async () => {
        await UserService.createUserToken(kakaoUserWithImg);

        expect(mockGetNewUser).toBeCalledTimes(1);
        expect(mockGetNewUser.mock.calls[0].length).toBe(2);
    });

    it('UserFunction.getNewUser 함수에 전달된 argument 첫 번째는 createUserToken의 argument, 두 번쨰는 UserRepo.findAllUser() 의 결과값이다.', async () => {
        await UserService.createUserToken(kakaoUserWithImg);
        const expectedArg1 = kakaoUserWithImg;
        const expectedArg2 = await UserRepo.findAllUser();

        expect(mockGetNewUser.mock.calls[0][0]).toEqual(expectedArg1);
        expect(mockGetNewUser.mock.calls[0][1]).toEqual(expectedArg2);
    });

    it('createUserToken 함수가 호출될 때, UserRepo.createUser 함수가 1번 호출되며, 이 때 전달된 argment는 1개이다.', async () => {
        await UserService.createUserToken(kakaoUserWithImg);

        expect(mockCreateUser).toBeCalledTimes(1);
        expect(mockCreateUser.mock.calls[0].length).toBe(1);
    });

    it('UserRepo.createUser 함수에 전달된 argment 값은 UserFunction.getNewUser 함수의 리턴값이다..', async () => {
        await UserService.createUserToken(kakaoUserWithImg);
        const argument1 = await UserRepo.findAllUser();
        const argument2 = await UserFunction.getNewUser(kakaoUserWithImg, argument1);

        expect(mockCreateUser).toBeCalledWith(argument2);
    });

    it('createUserToken 함수가 호출될 때, jwtService.createAccessToken 함수가 1번 호출되며, 이 때 전달된 argment는 1개이다.', async () => {
        await UserService.createUserToken(kakaoUserWithImg);

        expect(mockCreateAccessToken).toBeCalledTimes(1);
        expect(mockCreateAccessToken.mock.calls[0].length).toBe(1);
    });

    it('createUserToken 함수가 호출될 때, UserFunction.getPlayRecord 함수가 1번 호출되며, 이 때 전달된 argment는 1개이다.', async () => {
        await UserService.createUserToken(kakaoUserWithImg);

        expect(mockGetPlayRecord).toBeCalledTimes(1);
        expect(mockGetPlayRecord.mock.calls[0].length).toBe(1);
    });
});
