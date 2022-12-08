const UserRepo = require('./user-repo');
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
}

module.exports = new UserService();
