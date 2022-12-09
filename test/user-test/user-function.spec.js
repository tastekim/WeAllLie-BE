const UserFunction = require('../../src/users/util/user-function');
const {
    kakaoUserNotWithImg,
    kakaoUserWithImg,
    allUserLen0,
    allUserNotLen0,
} = require('../mockData/UserFuntionData');

describe('getNewUser funtion', () => {
    it('UserFunction 에  getNewUser function 이 존재한다', () => {
        expect(typeof UserFunction.getNewUser).toBe('function');
    });

    it('UserFunction.getNewUser 이 리턴하는 객체의 프로퍼티의 개수는 4개이다.', async () => {
        const allUser = allUserLen0;
        const kakaoUserInfo = kakaoUserNotWithImg;
        const result = await UserFunction.getNewUser(kakaoUserInfo, allUser);
        console.log(result);
        const propertyCount = await Object.keys(result).length;
        expect(propertyCount).toBe(4);
    });

    it('UserFunction.getNewUser 이 리턴하는 객체의 프로퍼티 이름은 "_id", "nickname", "email", "profileImg" 이다.', async () => {
        const allUser = allUserLen0;
        const kakaoUserInfo = kakaoUserNotWithImg;
        const result = await UserFunction.getNewUser(kakaoUserInfo, allUser);
        const properties = await Object.keys(result);
        console.log(properties);
        expect(properties.includes('_id')).toBeTruthy();
        expect(properties.includes('nickname')).toBeTruthy();
        expect(properties.includes('email')).toBeTruthy();
        expect(properties.includes('profileImg')).toBeTruthy();
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

describe('getPlayRecord funtion', () => {
    it('UserFunction 에  getPlayRecord function 이 존재한다', () => {
        expect(typeof UserFunction.getPlayRecord).toBe('function');
    });

    it('UserFunction.getPlayRecord 이 리턴하는 객체의 프로퍼티의 개수는 4개이다.', async () => {
        
    }
    
});
