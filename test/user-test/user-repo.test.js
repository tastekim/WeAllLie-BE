const UserRepo = require('../../src/users/user-repo');
const User = require('../../src/schemas/user');

// 실제로 User.create 가 실행되어 다른 테스트에 영향을 주지 않기 위해 mock 함수 사용!
User.create = jest.fn();

describe('createUser', () => {
    it('UserRepo 는 createUser function 을 가지고 있다.', () => {
        expect(typeof UserRepo.createUser).toBe('function');
    });
    it('UserRepo에서 User.create 가 정상적으로 호출되어야 한다.', (user) => {
        UserRepo.createUser(user);
        expect(User.create).toBeCalled();
    });
    it('', () => {});
});

// describe('', () => {
//     it('', () => {});
//     it('', () => {});
//     it('', () => {});
// });
