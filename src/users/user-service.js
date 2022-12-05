const UserRepo = require('./user-repo');
const jwtService = require('./util/jwt');
const UserFunction = require('./util/user-function');
const axios = require('axios');
const qs = require('qs');
require('dotenv').config();
console.log(process.env.CLIENT_ID);
console.log(process.env.CALLBACK_URL_LOCAL);

class UserService {
    // 카카오에 요청해서 토큰 받아오기
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

    /*
    1. 카카오에서 받은 토큰으로 다시 카카오로 유저정보를 요청해서 받아온다.
    2. DB에 유저 존재 여부 확인(카카오에서 받아온 유저정보의 이메일로 확인)
    3. 유저 존재 => 해당 유저의 _id로 토큰 발급해서 리턴
    4. 유저가 없을 경우 
        1) DB에 저장할 형태로 유저 정보 가공 
        2) 가공된 유저정보를 DB에 저장
        3) 새로 생성한 유저의 _id로 토큰 발급해서 리턴
    */
    getAccessToken = async (kakaoToken) => {
        const userInfo = await axios({
            method: 'POST',
            url: 'https://kapi.kakao.com/v2/user/me',
            headers: {
                'content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                Authorization: `Bearer ${kakaoToken}`,
            },
        });

        // DB에 유저 정보가 있는지 확인
        const userEmail = userInfo.data.kakao_account.email;
        const exUser = await UserRepo.findOneByEmail(userEmail);

        if (exUser) {
            // 유저가 존재한다면 바로 토큰 발급 후 전달
            const accessToken = await jwtService.createAccessToken(exUser._id);
            console.log('getAccessToken!, accessToken :::', accessToken);

            return [exUser.nickname, accessToken];
        } else {
            // 유저가 없다면 회원 가입 후 토큰 발급해서 전달
            // 저장할 형태로 유저정보 가공
            const allUser = await UserRepo.findAllUser();
            let newUser = await UserFunction.getNewUser(userInfo.data, allUser);
            console.log('이거 제대로 찍힘?? newUser', newUser);
            // DB에 유저 정보 저장, 토큰 발급과 프론트 전달을 위해 _id, nickname 가져오기

            console.log('여기는 user-service.js!!, newUser:::', newUser);
            // 새로 생셩한 newUser에게 _id 값으로 토큰 발급
            const newUserToken = await jwtService.createAccessToken(newUser._id);
            return { nickname: newUser.nickname, accessToken: newUserToken };
        }
    };
}

module.exports = new UserService();
