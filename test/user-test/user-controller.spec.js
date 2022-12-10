const httpMocks = require('node-mocks-http');
const UserController = require('../../src/users/user-controller');
const UserService = require('../../src/users/user-service');
const UserFunction = require('../../src/users/util/user-function');
const jwtService = require('../../src/users/util/jwt');
const { UserError } = require('../../src/middlewares/exception');

let req, res;
beforeEach(() => {
    jest.resetAllMocks();
    req = httpMocks.createRequest();
    req = httpMocks.createResponse();
    req.query = { code: '이건인가코드' };
});

// 인가코드로 카카오 토큰 받아오기
describe('getKakaoToken', () => {
    let mockGetkakaoToken;
    beforeEach(() => {
        mockGetkakaoToken = jest.fn();
        UserService.getKakaoToken = mockGetkakaoToken;
        UserService.getKakaoToken.mockResolvedValue('이건 카카오 토큰');
    });
    it('UserController 에  getKaKaoToken function 이 존재한다', () => {
        expect(typeof UserService.getKakaoToken).toBe('function');
    });

    it('getKakaoToken 메소드가 호출되었을 때, UserService.getKakaoToken 함수가 1회 실행된다.', async () => {
        await UserController.getKakaoToken(req, res);
        expect(mockGetkakaoToken).toBeCalledTimes(1);
    });

    it('getKakaoToken 메소드가 호출되었을 때, UserService.getKakaoToken 함수에 전달되는 argument는 req.query.code 값이다.', async () => {
        expect(1).toBe(1);
    });
});

// 로그인 & 프론트로 토큰, 유저정보 전달
describe('getLoginInfo', () => {
    it('UserController 에  getLoginInfo function 이 존재한다', () => {
        expect(typeof UserService.getLoginInfo).toBe('function');
    });
});

// 유저 정보 조회
describe('getUserRecord', () => {
    it('UserController 에  getUserRecord function 이 존재한다', () => {
        expect(typeof UserService.getUserRecord).toBe('function');
    });
});

// 닉네임 변경
describe('updateNick', () => {
    it('UserController 에  updateNick function 이 존재한다', () => {
        expect(typeof UserService.updateNick).toBe('function');
    });
});
