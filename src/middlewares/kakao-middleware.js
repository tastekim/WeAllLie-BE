const axios = require('axios');
const qs = require('qs');
require('dotenv').config();

// 인가 코드 받았을 때 다시 카카오로 요청해서 토큰 및 유저정보 받아와서 다음 미들웨어로 전달
module.exports = async (req, res, next) => {
  console.log('kakao-middleware.js 1, 인가코드::::::', req.query.code);

  const kakaoToken = await axios({
    method: 'POST',
    url: 'https://kauth.kakao.com/oauth/token',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    data: qs.stringify({
      grant_type: 'authorization_code',
      client_id: process.env.CLIENT_ID,
      redirectUri: process.env.CALLBACK_URL,
      code: req.query.code,
    }),
  });

  const result = await axios({
    method: 'get',
    url: 'https://kapi.kakao.com/v2/user/me',
    headers: {
      Authorization: `Bearer ${kakaoToken.data.access_token}`,
    },
  });

  res.locals.userInfo = result.data;

  console.log('kakao-middleware.js 2, kakaoToken::::::', kakaoToken.data);
  console.log('kakao-middleware.js 3, userInfo::::::', result.data);
  next();
};
