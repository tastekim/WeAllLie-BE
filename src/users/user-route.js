const authMiddleware = require('../middlewares/auth-middleware');
const passport = require('passport');
const express = require('express');
const router = express.Router();
const qs = require('qs');
const axios = require('axios');
const { User } = require('../schemas/user');
const loginMiddleware = require('../middlewares/login-middleware');
const jwtService = require('./jwt');

require('dotenv').config();

// 카카오 인가코드 받고 카카오에서 유저 정보 받아와서 전달
router.get('/api/auth/kakao/callback', loginMiddleware, async (req, res) => {
  console.log(req.query.code);
  let kakaoToken = await axios({
    method: 'POST',
    url: 'https://kauth.kakao.com/oauth/token',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    data: qs.stringify({
      grant_type: 'authorization_code',
      client_id: process.env.CLIENT_ID,
      redirectUri: process.env.CALLBACK_URL2,
      code: req.query.code,
    }),
  });
  let user;
  console.log(kakaoToken);
  user = await axios({
    method: 'get',
    url: 'https://kapi.kakao.com/v2/user/me',
    headers: {
      Authorization: `Bearer ${kakaoToken.data.access_token}`,
    },
  });
  console.log(user);

  let exUser = await User.findOne({
    email: user.kakao_account.email,
  });

  // DB에 유저 정보 있음 => 로그인 처리
  if (exUser) {
    console.log('exUser :::', exUser);
    const { user } = res.locals;
    // res.locals.user에 토큰이 없다면 재발급
    if (!user.accessToken) {
      const accessToken = await jwtService.createAccessToken(exUser.email);
      res.status(200).json({ accessToken });
    } else if (user.accessToken) res.status(200).json({ accessToken });
  } else {
    // DB에 유저 정보 없음 => 회원가입 / 토큰발급 / 로그인 처리
    let nickNum, nickname, newUser;
    let allUser = await User.find();

    if (allUser.length === 0) {
      newUser = await User.create({
        _id: 1,
        email: profile._json.kakao_account.email,
        nickname: 'Agent_001',
        profileImg: profile._json.properties.thumbnail_image
          ? profile._json.properties.thumbnail_image
          : 'default',
      });
    } else {
      let lastNum = allUser.slice(-1)[0].nickname;
      let n = +lastNum.slice(6) + 1;

      if (n < 1000) {
        nickNum = (0.001 * n).toFixed(3).toString().slice(2);
        nickname = `Agent_${nickNum}`;
      } else {
        nickname = `Agent_${n}`;
      }
      newUser = await User.create({
        _id: +nickNum + 1,
        email: profile._json.kakao_account.email,
        nickname,
        profileImg: profile._json.properties.thumbnail_image
          ? profile._json.properties.thumbnail_image
          : 'default',
      });
    }

    const accessToken = jwtService.createAccessToken(newUser.email);
    res.status(201).json({ accessToken });
  }
});

// PASSPORT 로그인
// 카카오 로그인(passport)
router.get('/api/passport/kakao', passport.authenticate('kakao'));

// 카카오 콜백(passport)
router.get(
  '/api/passport/kakao/callback',
  passport.authenticate('kakao', {
    successRedirect: '/',
    failureRedirect: '/',
  }),
  (req, res) => {
    console.log('콜백api / req.user ===', req.user); // 로그인 후 이동할 페이지 (프론트 url)
    res.redirect('/');
  }
);

// 카카오 로그인 후 성공 시 redirect 되는 URL
router.get('/', async (req, res) => {
  console.log(
    '여기가 패스포트 마지막 단계(req.user.accessToken)',
    req.user.accessToken
  );
  const accessToken = await req.user.accessToken;
  res.json({ accessToken });
});

module.exports = router;
