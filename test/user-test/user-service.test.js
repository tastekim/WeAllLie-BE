const UserController = require('../../src/users/user-controller');

describe('getKakaoToken', () => {
    it('UserController 는 getKaKaoToken function 을 가지고 있어야 한다.', () => {
        expect(typeof UserController.getKakaoToken).toBe('function');
    });
});

describe('getKakaoUserInfo', () => {
    it('UserController 는 getKakaoUserInfo function 을 가지고 있어야 한다.', () => {
        expect(typeof UserController.getKakaoUserInfo).toBe('function');
    });
});
