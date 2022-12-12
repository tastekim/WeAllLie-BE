const httpMocks = require('node-mocks-http');
const UserController = require('../../src/users/user-controller');
const UserService = require('../../src/users/user-service');
const { UserError } = require('../../src/middlewares/exception');
const { toSendInfo, allUserNotLen0 } = require('../mockData/user-data');

// 인가코드로 카카오 토큰 받아오기
describe('getKakaoToken', () => {
    let mockGetkakaoToken, req, res;
    beforeEach(() => {
        jest.resetAllMocks();
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        req.query.code = '이건 인가코드';
        mockGetkakaoToken = jest.fn();
        UserService.getKakaoToken = mockGetkakaoToken;
        UserService.getKakaoToken.mockResolvedValue('이건 카카오 토큰');
    });

    it('UserController 에  getKaKaoToken function 이 존재한다', () => {
        expect(typeof UserService.getKakaoToken).toBe('function');
    });

    it('getKakaoToken 함수가 호출되었을 때, UserService.getKakaoToken 함수가 1회 실행된다.', async () => {
        await UserController.getKakaoToken(req, res);
        expect(mockGetkakaoToken).toBeCalledTimes(1);
    });

    it('UserService.getKakaoToken 함수에 전달되는 argument는 req.query.code 값이다.', async () => {
        await UserController.getKakaoToken(req, res);
        expect(mockGetkakaoToken).toBeCalledWith('이건 인가코드');
    });

    it('getKakaoToken 함수가 호출되었을 때, 정상 실행되었다면 status code는 200, 보내는 데이터는 받은 카카오토큰을 응답으로 전달한다.', async () => {
        await UserController.getKakaoToken(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getData()).toStrictEqual({ accessToken: '이건 카카오 토큰' });
    });
});

// 로그인 & 프론트로 토큰, 유저정보 전달
describe('getLoginInfo', () => {
    let mockGetLoginInfo, req, res;
    beforeEach(() => {
        jest.resetAllMocks();
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        mockGetLoginInfo = jest.spyOn(UserService, 'getLoginInfo');
    });

    it('UserController 에  getLoginInfo function 이 존재한다', () => {
        expect(typeof UserService.getLoginInfo).toBe('function');
    });

    it('요청 헤더의 authorization에 토큰 타입이 "Bearer"가 아닐 경우 status code 400, "errorMessage: authorization 헤더 타입 인증 실패" 로 응답한다.', async () => {
        req.headers.authorization = 'notBearer 카카오토큰';
        await UserController.getLoginInfo(req, res);

        expect(res.statusCode).toBe(400);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getData()).toStrictEqual({ errorMessage: 'authorization 헤더 타입 인증 실패' });
    });

    it('요청 헤더의 authorization에 토큰이 없을 경우 status code 400, "errorMessage: 카카오 토큰이 헤더에 없습니다." 로 응답한다.', async () => {
        req.headers.authorization = 'Bearer ';
        await UserController.getLoginInfo(req, res);

        expect(res.statusCode).toBe(400);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getData()).toStrictEqual({ errorMessage: '카카오 토큰이 헤더에 없습니다.' });
    });

    it('이미 회원가입한 유저가 로그인에 성공하면 status code를 200으로 응답하고, 유저 정보를 전달한다.', async () => {
        UserService.getLoginInfo.mockResolvedValue([toSendInfo, 200]);
        req.headers = { authorization: 'Bearer 카카오토큰' };
        await UserController.getLoginInfo(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getData()).toStrictEqual(toSendInfo);
    });

    it('신규 유저가 로그인에 성공하면 status code를 201으로 응답하고, 유저 정보를 전달한다.', async () => {
        UserService.getLoginInfo.mockResolvedValue([toSendInfo, 201]);
        req.headers = { authorization: 'Bearer 카카오토큰' };
        await UserController.getLoginInfo(req, res);

        expect(res.statusCode).toBe(201);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getData()).toStrictEqual(toSendInfo);
    });
});

// 유저 정보 조회
describe('getUserRecord', () => {
    let mockGetUserRecord, req, res;
    beforeEach(() => {
        jest.resetAllMocks();
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        res.locals.user = allUserNotLen0[0];
        mockGetUserRecord = jest.spyOn(UserService, 'getUserRecord');
        UserService.getUserRecord.mockResolvedValue(toSendInfo);
    });

    it('UserController 에  getUserRecord function 이 존재한다', () => {
        expect(typeof UserService.getUserRecord).toBe('function');
    });

    it('getUserRecord 함수가 호출되었을 때, UserService.getUserRecord 함수가 1회 실행된다.', async () => {
        await UserController.getUserRecord(req, res);
        expect(mockGetUserRecord).toBeCalledTimes(1);
    });

    it('UserService.getUserRecord 함수가 호출될 때 전달되는 argument는 res.locals.user._id 값이다.', async () => {
        await UserController.getUserRecord(req, res);
        expect(mockGetUserRecord).toBeCalledWith(allUserNotLen0[0]._id);
    });

    it('유저 정보가 정상적으로 조회되면 status code 200으로 응답하고, 조회된 유저 정보를 전달한다.', async () => {
        await UserController.getUserRecord(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getData()).toStrictEqual(toSendInfo);
    });

    it('에러가 발생했을 경우 status code 500, errorMessage: "시스템에러메세지" 으로 응답한다.', async () => {
        // 커스텀 에러 객체 예외처리한 부분이 없으므로 에러가 발생했다면 시스템 에러가 발생했을 것.
        mockGetUserRecord.mockImplementation(() => {
            throw new Error('시스템에러메세지');
        });

        await UserController.getUserRecord(req, res);

        expect(res.statusCode).toBe(500);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getData()).toStrictEqual({ errorMessage: '시스템에러메세지' });
    });
});

// 닉네임 변경
describe('updateNick', () => {
    let mockUpdateNick, req, res;
    beforeEach(() => {
        jest.resetAllMocks();
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        res.locals.user = allUserNotLen0[0];
        req.body.nickname = '수정요청닉네임';
        mockUpdateNick = jest.spyOn(UserService, 'updateNick');
    });

    it('UserController 에  updateNick function 이 존재한다', () => {
        expect(typeof UserService.updateNick).toBe('function');
    });

    it('UserController.updateNick 함수가 호출되었을 때, UserService.updateNick 함수가 1회 실행된다.', async () => {
        await UserController.updateNick(req, res);
        expect(mockUpdateNick).toBeCalledTimes(1);
    });

    it('UserService.updateNick 함수가 호출될 때 전달되는 argument는 res.locals.user._id와 req.body로 전달받은 nickname 이다.', async () => {
        await UserController.updateNick(req, res);
        expect(mockUpdateNick).toBeCalledWith(allUserNotLen0[0]._id, '수정요청닉네임');
    });

    it('중복된 닉네임일 경우 status code 400, errorMessage: "닉네임 중복" 으로 응답한다.', async () => {
        mockUpdateNick.mockImplementation(() => {
            throw new UserError('닉네임 중복', 400);
        });

        await UserController.updateNick(req, res);

        expect(res.statusCode).toBe(400);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getData()).toStrictEqual({ errorMessage: '닉네임 중복' });
    });

    it('닉네임을 입력하지 않았다면 status code 400, errorMessage: "변경할 닉네임을 입력해주세요" 으로 응답한다.', async () => {
        req.body.nickname = '';
        await UserController.updateNick(req, res);

        expect(res.statusCode).toBe(400);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getData()).toStrictEqual({ errorMessage: '변경할 닉네임을 입력해주세요' });
    });

    it('닉네임에 공백이 있다면 status code 400, errorMessage: "닉네임에 공백이 포함될 수 없습니다." 으로 응답한다.', async () => {
        req.body.nickname = '공 백 있 음';
        await UserController.updateNick(req, res);

        expect(res.statusCode).toBe(400);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res._getData()).toStrictEqual({
            errorMessage: '닉네임에 공백이 포함될 수 없습니다.',
        });
    });
});
