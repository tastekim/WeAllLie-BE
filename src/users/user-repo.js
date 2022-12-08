const User = require('../schemas/user');
const axios = require('axios');
const qs = require('qs');
require('dotenv').config();

class UserRefo {
    //
    findAllUser = async () => {
        const allUser = await User.find({});
        return allUser;
    };

    findOneByEmail = async (email) => {
        const exUser = await User.findOne({ email });
        return exUser;
    };

    findOneByNickname = async (nickname) => {
        const exUser = await User.findOne({ nickname });
        return exUser;
    };

    findOneById = async (id) => {
        const exUser = await User.findById(id);
        return exUser;
    };

    getKakaoToken = async (code) => {
<<<<<<< HEAD
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
        } catch (e) {
            return e;
        }
=======
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
>>>>>>> parent of e5a3b68 (일단 에러 핸들 각 파일 내에서 처리하도록 변경 / 닉네임변경, 유저 전적조회 api 추가(로컬 테스트 완료))
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

    getPlayRecord = async (user, accessToken) => {
        let spyWinRating, voteSpyRating;

        spyWinRating = (user.spyWinCount / user.spyPlayCount).toFixed(2) * 100;
        voteSpyRating =
            (user.voteSpyCount / (user.totalCount - user.spyPlayCount)).toFixed(2) * 100;

        if (user.totalCount === 0) {
            return {
                accessToken,
                userId: user._id,
                nickname: user.nickname,
                profileImg: user.profileImg,
                totayPlayCount: user.totalCount,
                spyPlayCount: user.spyPlayCount,
                ctzPlayCount: user.totalCount - user.spyPlayCount,
                spyWinRating: 0,
                voteSpyRating: 0,
            };
        } else if (user.spyPlayCount === 0 && user.totalCount - user.spyPlayCount !== 0) {
            return {
                accessToken,
                userId: user._id,
                nickname: user.nickname,
                profileImg: user.profileImg,
                totayPlayCount: user.totalCount,
                spyPlayCount: user.spyPlayCount,
                ctzPlayCount: user.totalCount - user.spyPlayCount,
                spyWinRating: 0,
                voteSpyRating,
            };
        } else if (user.spyPlayCount !== 0 && user.totalCount - user.spyPlayCount === 0) {
            return {
                accessToken,
                userId: user._id,
                nickname: user.nickname,
                profileImg: user.profileImg,
                totayPlayCount: user.totalCount,
                spyPlayCount: user.spyPlayCount,
                ctzPlayCount: user.totalCount - user.spyPlayCount,
                spyWinRating,
                voteSpyRating: 0,
            };
        }

        spyWinRating = (user.spyWinCount / user.spyPlayCount).toFixed(2) * 100;
        voteSpyRating =
            (user.voteSpyCount / (user.totalCount - user.spyPlayCount)).toFixed(2) * 100;

        return {
            accessToken,
            userId: user._id,
            nickname: user.nickname,
            profileImg: user.profileImg,
            totayPlayCount: user.totalCount,
            spyPlayCount: user.spyPlayCount,
            ctzPlayCount: user.totalCount - user.spyPlayCount,
            spyWinRating,
            voteSpyRating,
        };
    };

    createNewUser = async (kakaoUserInfo, allUser) => {
        const allUserCount = allUser.length;
        let nickNum, nickname, _id;

        // DB에 유저가 하나도 없다면 초기값 세팅
        if (allUserCount === 0) {
            _id = 1;
            nickname = 'Agent_001';
        } else {
            // DB에 유저가 있을 경우
            const n = +allUser[allUserCount - 1]._id + 1;
            // n이 1000이상이면 Agent_ 뒤에 그대로 붙이고, 1000보다 작으면 001 의 형태로 붙이기
            if (n < 1000) {
                nickNum = (0.001 * n).toFixed(3).toString().slice(2);
                nickname = `Agent_${nickNum}`;
            } else {
                nickname = `Agent_${n}`;
            }
            _id = +nickNum;
        }
        // 위에서 만든 값으로 newUser DB 에 저장하기
        const newUser = await User.create({
            _id,
            nickname,
            email: kakaoUserInfo.kakao_account.email,
            profileImg: kakaoUserInfo.properties.thumbnail_image
                ? kakaoUserInfo.properties.thumbnail_image
                : 'default',
        });
        return newUser;
    };
}

module.exports = new UserRefo();
