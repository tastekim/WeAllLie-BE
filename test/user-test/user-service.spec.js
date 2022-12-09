const UserService = require('../../src/users/user-service');
const UserRepo = require('../../src/users/user-repo');
const { toSaveInfo } = require('../mockData/user-repo-data');

// 인가코드로 카카오 토큰 받아오기
describe('getKakaoToken', () => {
    it('UserService 에  getKaKaoToken function 이 존재한다', () => {
        expect(typeof UserService.getKakaoToken).toBe('function');
    });
});

// 로그인 시 프론트로 전달할 정보
describe('getLoginInfo', () => {
    it('UserService 에  getLoginInfo function 이 존재한다', () => {
        expect(typeof UserService.getLoginInfo).toBe('function');
    });
});

// 유저 정보 조회
describe('getUserRecord', () => {
    it('UserService 에  getUserRecord function 이 존재한다', () => {
        expect(typeof UserService.getUserRecord).toBe('function');
    });
});

// 유저 닉네임 수정
describe('updateNick', () => {
    it('UserService 에  updateNick function 이 존재한다', () => {
        expect(typeof UserService.updateNick).toBe('function');
    });
});

// 가입된 유저에 대해 토큰 발급 & 프론트에 보낼 정보로 가공
describe('getExUserInfo', () => {
    it('UserService 에  getExUserInfo function 이 존재한다', () => {
        expect(typeof UserService.getExUserInfo).toBe('function');
    });
});

// 신규 유저 생성 & 토큰 발급 & 프론트에 보낼 정보로 가공
describe('createUserToken', () => {
    it('UserService 에  createUserToken function 이 존재한다', () => {
        console.log(typeof UserService.createUserToken);
        expect(typeof UserService.createUserToken).toBe('function');
    });

    it('createUserToken function이 호출되면 UserRepo.findAllUser 함수가 1번 호출된다.', async () => {});
});
