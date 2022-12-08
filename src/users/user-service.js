const UserRepo = require('./user-repo');
const jwtService = require('../users/util/jwt');
const UserFunction = require('../users/util/user-function');
const { UserError } = require('../middlewares/exception');
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
            /*
            // with FE
            data: qs.stringify({
                grant_type: 'authorization_code',
                client_id: process.env.CLIENT_ID_FRONT,
                client_secret: process.env.CLIENT_SECRET,
                redirectUri: process.env.CALLBACK_URL_LOCAL,
                code: code,
            }),

            */
            // BE test
            data: qs.stringify({
                grant_type: 'authorization_code',
                client_id: process.env.CLIENT_ID,
                redirectUri: process.env.CALLBACK_URL_LOCAL,
                code: code,
            }),
        });

        return kakaoToken.data.access_token;
    };

    loginInfo = async (kakaoToken) => {
        const userInfo = await axios({
            method: 'POST',
            url: 'https://kapi.kakao.com/v2/user/me',
            headers: {
                'content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                Authorization: `Bearer ${kakaoToken}`,
            },
        });

        // userInfo.data : 카카오에서 받은 정보 중 우리에게 필요한 유저 데이터
        console.log('카카오에서 가져온 유저 정보::::::', userInfo.data);

        // 카카오에서서 받은 유저정보에서 이메일로 DB에 저장된 유저 확인, 존재한다면 유저정보 가져오기 (undefinded일 수도.)
        const isExistUser = await this.exUserGetToken(userInfo.data);

        // 1. 가입한 유저 => 토큰 + 유저정보 바로 전달
        if (isExistUser) {
            console.log('이미 가입되어 있는 유저 정보 :::', isExistUser);
            return [isExistUser, 200];
        }

        // 2. 미가입 유저 => 회원가입 + 토큰발급 후 토큰 + 유저정보 전달
        const newUser = await this.createUserToken(userInfo.data);
        console.log('user-service.js, 새로 가입한 유저 정보 :::', newUser);
        return [newUser, 201];
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
            const userInfo = await UserRepo.findOneById(_id);
            const userRecord = await UserFunction.getPlayRecord(userInfo);
            console.log('유저 정보 전적으로 가공 후 !! userRecord ::', userRecord);
            return userRecord;
        } catch (e) {
            return e;
        }
    };

    updateNick = async (_id, nickname) => {
        try {
            const isExistNick = await UserRepo.findOneByNickname(nickname);
            if (isExistNick) throw new UserError('닉네임 중복', 400);
            await UserRepo.updateNick(_id, nickname);
            return;
        } catch (e) {
            throw e;
        }
    };
}

module.exports = new UserService();
