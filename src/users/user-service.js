const UserRepo = require('./user-repo');
const jwtService = require('../users/util/jwt');
const UserFunction = require('../users/util/user-function');
const axios = require('axios');
const qs = require('qs');

class UserService {
    getKakaoToken = async (code) => {
        const kakaoToken = await axios({
            method: 'POST',
            url: 'https://kauth.kakao.com/oauth/token',
            headers: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
            },

            // with FE
            data: qs.stringify({
                grant_type: 'authorization_code',
                client_id: process.env.CLIENT_ID_FRONT,
                client_secret: process.env.CLIENT_SECRET,
                redirectUri: process.env.CALLBACK_URL_LOCAL,
                code: code,
            }),

            /*
            // BE test
            data: qs.stringify({
                grant_type: 'authorization_code',
                client_id: process.env.CLIENT_ID,
                redirectUri: process.env.CALLBACK_URL_LOCAL,
                code: code,
            }),
            */
        });

        return kakaoToken.data.access_token;
    };

    getKakaoUserInfo = async (kakaoToken) => {
        const userInfo = await axios({
            method: 'POST',
            url: 'https://kapi.kakao.com/v2/user/me',
            headers: {
                'content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                Authorization: `Bearer ${kakaoToken}`,
            },
        });
        return userInfo.data;
    };

    exUserGetToken = async (kakaoUserInfo) => {
        // 존재하는 유저일 경우 토큰 발급하여 가져오기
        console.log('-------------------------------------------');
        console.log('여기는 user-service.js 의 exUserGetToken!!!!!');

        const exUser = await UserRepo.findOneByEmail(kakaoUserInfo.kakao_account.email);
        console.log('exUserGetToken 1, exUser:::::: ', exUser);

        if (exUser) {
            const accessToken = await jwtService.createAccessToken(exUser._id);
            console.log('exUserGetToken 2, accessToken::::::', accessToken);

            const playRecord = await UserFunction.getPlayRecord(exUser);
            playRecord.accessToken = accessToken;
            console.log('exUserGetToken 3, playRecord::::::', playRecord);
            return playRecord;
        } else return;
    };
    // DB에 유저 정보 없음 => DB 저장 / 토큰발급 / 토큰 + 유저 게임정보 리턴
    createUserToken = async (kakaoUserInfo) => {
        console.log('-------------------------------------------');
        console.log('여기는 user-provider.js 의 createUserToken!!!!!');

        const allUser = await UserRepo.findAllUser();
        const newUser = await UserRepo.createNewUser(kakaoUserInfo, allUser);

        console.log('여기는 user-service.js 3, newUser::::::', newUser);

        // 새로 생셩한 newUser에게 _id 값으로 토큰 발급
        const newUserToken = await jwtService.createAccessToken(newUser._id);

        // 클라이언트에 전달하기 위해 유저 정보 가공
        const playRecord = await UserFunction.getPlayRecord(newUser);
        playRecord.accessToken = newUserToken;
        return playRecord;
    };

    getUserRecord = async (_id) => {
        try {
            const exUser = await UserRepo.findOneById(_id);
            const userInfo = await UserFunction.getPlayRecord(exUser);
            console.log('유저 정보 전적으로 가공 후 !! userInfo ::', userInfo);
            return userInfo;
        } catch (e) {
            return e;
        }
    };
}

module.exports = new UserService();
