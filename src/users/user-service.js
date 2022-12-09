const UserRepo = require('./user-repo');
const jwtService = require('../users/util/jwt');
const UserFunction = require('../users/util/user-function');
const { UserError } = require('../middlewares/exception');
const axios = require('axios');
const qs = require('qs');

class UserService {
    // 인가코드 주고 카카오 토큰 받아오기
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

    /*
    // 로그인할 때 프론트로 전달할 정보
    1. 카카오로 토큰을 보내서 유저 정보를 받아온다.
    2. 받은 정보 중 이메일로 DB 조회하여 가입 여부 확인
    3. 가입된 유저 => 토큰 + 유저정보 바로 전달
    4. 미가입 유저 => 회원가입 + 토큰발급 후 토큰 + 유저정보 전달
    */
    getLoginInfo = async (kakaoToken) => {
        const userInfo = await axios({
            method: 'POST',
            url: 'https://kapi.kakao.com/v2/user/me',
            headers: {
                'content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                Authorization: `Bearer ${kakaoToken}`,
            },
        });

        console.log('카카오에서 가져온 유저 정보 userInfo.data:::', userInfo.data);

        // 카카오에서서 받은 이메일로 DB에 저장된 유저 확인
        const isExistUser = await UserRepo.findOneByEmail(userInfo.data.kakao_account.email);

        // 1. 가입한 유저 => 토큰 + 유저정보 바로 전달
        if (isExistUser) {
            console.log('이미 가입되어 있는 유저 정보 :::', isExistUser);
            const toSendInfo = await this.getExUserInfo(isExistUser);
            return [toSendInfo, 200];
        }

        // 2. 미가입 유저 => 회원가입 + 토큰발급 후 토큰 + 유저정보 전달
        const newUser = await this.createUserToken(userInfo.data);
        console.log('user-servic.js, 새로 가입한 유저 정보 :::', newUser);
        return [newUser, 201];
    };

    // 유저 정보 조회
    getUserRecord = async (_id) => {
        const userInfo = await UserRepo.findOneById(_id);
        const userRecord = await UserFunction.getPlayRecord(userInfo);
        console.log('DB 유저 정보 전적으로 가공 후 !! userRecord ::', userRecord);
        return userRecord;
    };

    // 유저 닉네임 수정
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

    // 가입된 유저 : 토큰 발급하여 프론트에 보낼 상태로 가공해서 리턴
    getExUserInfo = async (isExistUser) => {
        const accessToken = await jwtService.createAccessToken(isExistUser._id);
        console.log('getExUserInfo 1, accessToken::::::', accessToken);

        const playRecord = await UserFunction.getPlayRecord(isExistUser);
        playRecord.accessToken = accessToken;
        console.log('getExUserInfo 2, playRecord::::::', playRecord);
        return playRecord;
    };

    // 신규 유저 생성
    createUserToken = async (kakaoUserInfo) => {
        const allUser = await UserRepo.findAllUser();

        // 카카오 유저 정보를 DB에 저장할 형태로 가공 & DB 저장
        const toSaveInfo = await UserFunction.getNewUser(kakaoUserInfo, allUser);
        console.log('DB에 저장할 유저 정보, toSaveInfo:::', toSaveInfo);
        const newUser = await UserRepo.createUser(toSaveInfo);

        // 새로 생성한 newUser에게 _id 값으로 토큰 발급 & 보낼 정보 가공
        const newUserToken = await jwtService.createAccessToken(newUser._id);
        const playRecord = await UserFunction.getPlayRecord(newUser);
        playRecord.accessToken = newUserToken;

        return playRecord;
    };
}

module.exports = new UserService();
