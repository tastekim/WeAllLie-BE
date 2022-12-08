const UserRepo = require('./user-repo');
const jwtService = require('../users/util/jwt');
const { UserError } = require('../middlewares/exception');
const UserFunction = require('../users/util/user-function');
const axios = require('axios');
const qs = require('qs');

class UserService {
    getKakaoToken = async (code) => {
        try {
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

                // BE test
                data: qs.stringify({
                    grant_type: 'authorization_code',
                    client_id: process.env.CLIENT_ID,
                    redirectUri: process.env.CALLBACK_URL_LOCAL,
                    code: code,
                }),
            });
            return kakaoToken.data.access_token;
        } catch (e) {
            return e;
        }
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
        try {
            // 1. 토큰 보내고 유저 정보 받아오기
            const kakaoInfo = await axios({
                method: 'POST',
                url: 'https://kapi.kakao.com/v2/user/me',
                headers: {
                    'content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                    Authorization: `Bearer ${kakaoToken}`,
                },
            });

            // 2. DB에 유저 정보가 있는지 확인
            const userEmail = kakaoInfo.data.kakao_account.email;
            if (!userEmail) throw new UserError('카카오 이메일 정보 확인 실패');

            const exUser = await UserRepo.findOneByEmail(userEmail);
            console.log('카카오에서 받은 이메일 정보로 DB 검색한 결과! exUser ::', exUser);
            if (exUser) {
                // 3. 유저가 존재한다면 바로 토큰 발급 후 닉네임과 함께 전달
                const accessToken = await jwtService.createAccessToken(exUser._id);
                console.log('존재하는 유저에게 토큰 발급!, accessToken :::', accessToken);
                console.log('exUser.nickname ::', exUser.nickname);
                let toSendInfo = await UserFunction.getPlayRecord(exUser);
                toSendInfo.accessToken = accessToken;
                console.log('toSendInfo', toSendInfo);
                return toSendInfo;
            } else {
                // 4. DB에 유저 정보 없음 => 회원가입 => 토큰 발급

                // 4-1. DB에 저장할 형태로 유저정보 가공
                const allUser = await UserRepo.findAllUser();
                const toSaveInfo = await UserFunction.getNewUser(kakaoInfo.data, allUser);

                // 4-2. DB 저장
                await UserRepo.createUser(toSaveInfo);

                // 4-3. newUser에게 _id 값으로 토큰 발급
                const newUserToken = await jwtService.createAccessToken(toSaveInfo._id);
                return {
                    accessToken: newUserToken,
                    userId: toSaveInfo._id,
                    nickname: toSaveInfo.nickname,
                    profileImg: toSaveInfo.profileImg,
                    totalPlayCount: 0,
                    spyPlayCount: 0,
                    ctzPlayCount: 0,
                    spyWinRating: 0,
                    voteSpyRating: 0,
                };
            }
        } catch (e) {
            return e;
        }
    };
}

module.exports = new UserService();
