const UserService = require('../../src/users/user-controller');

describe('getKakaoToken', () => {
    it('UserService 에  getKaKaoToken function 이 존재한다', () => {
        expect(typeof UserService.getKakaoToken).toBe('function');
    });
});

describe('getLoginInfo', () => {
    it('UserService 에  getLoginInfo function 이 존재한다', () => {
        expect(typeof UserService.getLoginInfo).toBe('function');
    });
});

describe('getUserRecord', () => {
    it('UserService 에  getUserRecord function 이 존재한다', () => {
        expect(typeof UserService.getUserRecord).toBe('function');
    });
});

describe('updateNick', () => {
    it('UserService 에  updateNick function 이 존재한다', () => {
        expect(typeof UserService.updateNick).toBe('function');
    });
});

describe('getUserRecord', () => {
    it('UserService 에  getUserRecord function 이 존재한다', () => {
        expect(typeof UserService.getUserRecord).toBe('function');
    });
});

describe('getExUserInfo', () => {
    it('UserService 에  getExUserInfo function 이 존재한다', () => {
        expect(typeof UserService.getExUserInfo).toBe('function');
    });
});

describe('createUserToken', () => {
    it('UserService 에  createUserToken function 이 존재한다', () => {
        expect(typeof UserService.createUserToken).toBe('function');
    });
});
