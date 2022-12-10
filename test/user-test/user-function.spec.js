const UserFunction = require('../../src/users/util/user-function');
const {
    kakaoUserNotWithImg,
    kakaoUserWithImg,
    allUserLen0,
    allUserNotLen0,
} = require('../mockData/user-function-data');

// mockData

describe('getNewUser funtion TEST', () => {
    it('UserFunction 에  getNewUser function 이 존재한다', () => {
        expect(typeof UserFunction.getNewUser).toBe('function');
    });

    it('UserFunction.getNewUser 이 리턴하는 객체의 프로퍼티의 개수는 4개이다.', async () => {
        const allUser = allUserLen0;
        const kakaoUserInfo = kakaoUserNotWithImg;
        const result = await UserFunction.getNewUser(kakaoUserInfo, allUser);
        const propertyCount = await Object.keys(result).length;
        expect(propertyCount).toBe(4);
    });

    it('UserFunction.getNewUser 이 리턴하는 객체의 프로퍼티 이름은 "_id", "nickname", "email", "profileImg" 이다.', async () => {
        const expected = ['_id', 'nickname', 'email', 'profileImg'];
        const allUser = allUserLen0;
        const kakaoUserInfo = kakaoUserNotWithImg;
        const result = await UserFunction.getNewUser(kakaoUserInfo, allUser);
        const properties = Object.keys(result);
        expect(properties).toEqual(expect.arrayContaining(expected));
    });

    it('인자로 전달받은 allUser 배열의 길이가 0이라면 리턴하는 객체의 _id 프로퍼티 값은 1이다.', async () => {
        const allUser = allUserLen0;
        const kakaoUserInfo = kakaoUserNotWithImg;
        const result = await UserFunction.getNewUser(kakaoUserInfo, allUser);
        expect(result._id).toBe(1);
    });

    it('인자로 전달받은 allUser 배열의 길이가 0이라면 리턴하는 객체의 nickname 프로퍼티 값은 "Agent_001"이다.', async () => {
        const allUser = allUserLen0;
        const kakaoUserInfo = kakaoUserNotWithImg;
        const result = await UserFunction.getNewUser(kakaoUserInfo, allUser);
        expect(result.nickname).toBe('Agent_001');
    });

    it('UserFunction.getNewUser 이 리턴하는 객체의 email 프로퍼티 값은 kakaoUserInfo.kakao_account.email 이다.', async () => {
        const allUser = allUserNotLen0;
        const kakaoUserInfo = kakaoUserNotWithImg;
        const result = await UserFunction.getNewUser(kakaoUserInfo, allUser);
        expect(result.email).toBe(kakaoUserInfo.kakao_account.email);
    });

    it('첫 번째 argument에 thumbnail_image 값이 존재하지 않는다면 UserFunction.getNewUser 함수가 리턴하는 객체의 profileImg 프로퍼티 값은 "default" 이다.', async () => {
        const allUser = allUserNotLen0;
        const kakaoUserInfo = kakaoUserNotWithImg;
        const result = await UserFunction.getNewUser(kakaoUserInfo, allUser);
        expect(result.profileImg).toBe('default');
    });

    it('첫 번째 argument에 thumbnail_image 값이 존재한다면 UserFunction.getNewUser 함수가 리턴하는 객체의 profileImg 프로퍼티 값은 kakaoUserInfo.properties.thumbnail_image 이다.', async () => {
        const allUser = allUserNotLen0;
        const kakaoUserInfo = kakaoUserWithImg;
        const result = await UserFunction.getNewUser(kakaoUserInfo, allUser);
        expect(result.profileImg).toBe(kakaoUserInfo.properties.thumbnail_image);
    });
});

describe('getPlayRecord funtion TEST', () => {
    let defaultInfo;
    beforeEach(() => {
        defaultInfo = async (user) => {
            return {
                userId: user._id,
                nickname: user.nickname,
                profileImg: user.profileImg,
                totalPlayCount: user.totalCount,
                spyPlayCount: user.spyPlayCount,
                ctzPlayCount: user.totalCount - user.spyPlayCount,
            };
        };
    });

    it('UserFunction 에  getPlayRecord function 이 존재한다', () => {
        expect(typeof UserFunction.getPlayRecord).toBe('function');
    });

    it('UserFunction.getPlayRecord 이 리턴하는 객체의 프로퍼티의 개수는 4개이다.', async () => {
        const user = allUserNotLen0;
        const result = await UserFunction.getPlayRecord(user);
        const propertyCount = Object.keys(result).length;
        expect(propertyCount).toBe(8);
    });

    it('UserFunction.getPlayRecord 이 리턴하는 객체의 프로퍼티 이름은 "userId", "nickname", "profileImg", "totalPlayCount", "spyPlayCount", "ctzPlayCount", "spyWinRating", "voteSpyRating" 이다.', async () => {
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
        const user = allUserNotLen0;
        const result = await UserFunction.getPlayRecord(user);
        const properties = Object.keys(result);
        console.log(properties);

        expect(properties).toEqual(expect.arrayContaining(expected));
    });

    it('유저 전적 totalCount === 0 이면 UserFunction.getPlayRecord 리턴하는 객체의 spyWinRating, voteSpyRating 프로퍼티 값이 모두 0이다.', async () => {
        const user = allUserNotLen0[0];
        const result = await UserFunction.getPlayRecord(user);

        expect(result.spyWinRating).toBe(0);
        expect(result.voteSpyRating).toBe(0);
    });

    it('유저 전적의 spyPlayCount === 0 이면서 totalCount - spyPlayCount !== 0 이면 UserFunction.getPlayRecord 리턴하는 객체의 spyWinRating 값은 0이고,  voteSpyRating 값은 0이 아니다.', async () => {
        const user = allUserNotLen0[1];
        const result = await UserFunction.getPlayRecord(user);

        expect(result.spyWinRating).toBe(0);
        expect(result.voteSpyRating).not.toBe(0);
    });

    it('유저 전적의 spyPlayCount !== 0 이면서 totalCount - spyPlayCount === 0 이면 UserFunction.getPlayRecord 리턴하는 객체의 spyWinRating 값은 0이고,  voteSpyRating 값은 0이 아니다.', async () => {
        const user = allUserNotLen0[2];
        const result = await UserFunction.getPlayRecord(user);

        expect(result.spyWinRating).not.toBe(0);
        expect(result.voteSpyRating).toBe(0);
    });

    it('유저 전적의 spyPlayCount !== 0 이면서 totalCount - spyPlayCount !== 0 이면 UserFunction.getPlayRecord 리턴하는 객체의 spyWinRating, voteSpyRating 프로퍼티 값이 모두 0이 아니다.', async () => {
        const user = allUserNotLen0[3];
        const result = await UserFunction.getPlayRecord(user);

        expect(result.spyWinRating).not.toBe(0);
        expect(result.voteSpyRating).not.toBe(0);
    });

    it('유저 전적을 통해 가공한 결과인 spyWinRating 값이 0이 아닐 경우, spyWinRating 은 0~100 사이의 정수값을 가진다.', async () => {
        const user = allUserNotLen0[3];
        const result = await UserFunction.getPlayRecord(user);
        expect(result.spyWinRating % 1 === 0).toBeTruthy();
        expect(result.spyWinRating > 0).toBeTruthy();
        expect(result.spyWinRating < 100).toBeTruthy();
    });

    it('유저 전적을 통해 가공한 결과인 voteSpyRating 값이 0이 아닐 경우, spyWinRating 은 0~100 사이의 정수값을 가진다.', async () => {
        const user = allUserNotLen0[3];
        const result = await UserFunction.getPlayRecord(user);
        expect(result.voteSpyRating % 1 === 0).toBeTruthy();
        expect(result.voteSpyRating > 0).toBeTruthy();
        expect(result.voteSpyRating < 100).toBeTruthy();
    });
});
