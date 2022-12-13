const UserFunction = require('../../src/users/util/user-function');
const {
    kakaoUserNotWithImg,
    kakaoUserWithImg,
    allUserLen0,
    allUserNotLen0,
    playRecord,
} = require('../mockData/user-data');

// mockData

describe('getNewUser funtion TEST', () => {
    it('UserFunction 에  getNewUser function 이 존재한다', () => {
        expect(typeof UserFunction.getNewUser).toBe('function');
    });

    it('UserFunction.getNewUser 이 리턴하는 객체의 프로퍼티의 개수는 4개이다.', async () => {
        const allUser = allUserLen0;
        const kakaoUserInfo = kakaoUserNotWithImg;
        const result = await UserFunction.getNewUser(kakaoUserInfo, allUser);
        const propertyCount = Object.keys(result).length;
        expect(propertyCount).toBe(4);
    });

    it('UserFunction.getNewUser 이 리턴하는 객체의 프로퍼티 이름은 "_id", "nickname", "email", "profileImg" 이다.', async () => {
        const expected = ['_id', 'nickname', 'email', 'profileImg'];
        const allUser = allUserLen0;
        const kakaoUserInfo = kakaoUserNotWithImg;
        const result = await UserFunction.getNewUser(kakaoUserInfo, allUser);
        expect(result).toHaveProperty(...expected);
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

    it('DB에 유저 정보가 하나도 없을 경우, 처음 가입하는 유저의 자동 생성 닉네임은 "Agent_001"이다.', async () => {
        const allUser = allUserLen0;
        const kakaoUserInfo = kakaoUserWithImg;
        const result = await UserFunction.getNewUser(kakaoUserInfo, allUser);
        expect(result.nickname).toBe('Agent_001');
    });

    it('DB의 마지막 유저의 id 값이 99보다 작더라도 신규유저의 자동 생성 닉네임 뒤의 숫자는 무조건 3자리로 표시된다.', async () => {
        // 예를 들어 (마지막 유저 id) = 1 이라면, (신규유저 닉네임) = 'Agent_002'
        const allUser = allUserNotLen0; // allUserNotLen0 의 마지막 User 의 id = 11
        const kakaoUserInfo = kakaoUserWithImg;
        const result = await UserFunction.getNewUser(kakaoUserInfo, allUser);
        expect(result.nickname.slice(6).length).toBe(3);
    });

    it('DB의 마지막 유저의 id 값이 999보다 같거나 클 경우 신규유저의 자동 생성 닉네임 뒤의 숫자는 (마지막 유저의 id + 1) 이다.', async () => {
        const lastUser = { _id: 1234 };
        allUserNotLen0.push(lastUser);
        const allUser = allUserNotLen0;
        const kakaoUserInfo = kakaoUserWithImg;
        const result = await UserFunction.getNewUser(kakaoUserInfo, allUser);
        expect(+result.nickname.slice(6)).toBe(+lastUser._id + 1);
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

    it('UserFunction.getPlayRecord 이 리턴하는 객체의 프로퍼티의 개수는 8개이다.', async () => {
        const user = allUserNotLen0[0];
        const result = await UserFunction.getPlayRecord(user);
        const propertyCount = Object.keys(result).length;

        expect(propertyCount).toBe(8);
    });

    it('UserFunction.getPlayRecord 이 리턴하는 객체의 프로퍼티 이름은 "userId", "nickname", "profileImg", "totalPlayCount", "spyPlayCount", "ctzPlayCount", "spyWinRating", "voteSpyRating" 이다.', async () => {
        const expected = Object.keys(playRecord);
        const user = allUserNotLen0[0];
        const result = await UserFunction.getPlayRecord(user);

        expect(result).toHaveProperty(...expected);
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

    it('유저 전적을 통해 가공한 결과인 voteSpyRating 값이 0이 아닐 경우, voteSpyRating 은 0~100 사이의 정수값을 가진다.', async () => {
        const user = allUserNotLen0[3];
        const result = await UserFunction.getPlayRecord(user);

        expect(result.voteSpyRating % 1 === 0).toBeTruthy();
        expect(result.voteSpyRating > 0).toBeTruthy();
        expect(result.voteSpyRating < 100).toBeTruthy();
    });
});
