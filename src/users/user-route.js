const authMiddleware = require('../middlewares/auth-middleware');
const passport = require('passport');
const express = require('express');
const router = express.Router();
const qs = require('qs');
const axios = require('axios');
const { User } = require('../schemas/user');
const isLoginMiddleware = require('../middlewares/login-middleware');
const jwtService = require('./jwt');

require('dotenv').config();

// 카카오 로그인 후 성공 시 redirect 되는 URL
router.get('/', (req, res) => {
  console.log(req.user);
  return res.send(req.user);
});
/*
// 카카오 인가코드 받고 카카오에서 유저 정보 받아와서 전달
router.get('/api/auth/kakao/callback', isLoginMiddleware, async (req, res) => {
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

  // user.properties.profile_image
  // user.properties.thumbnail_image
  // user.properties.nickname
  // user.kakao_account.email
  // _id  or  id 인지 확인

  let exUser = await User.findOne({
    email: user.kakao_account.email,
  });

  // DB 의 유저 정보 확인하여 존재하는 유저일 경우?
  if (exUser) {
    console.log('exUser :::', exUser);
    const { user } = res.locals;
    // 1. res.locals.user에 토큰이 없다면 만료된 토큰이므로 재발급
    if (!user.accessToken) {
      const accessToken = jwtService.createAccessToken(exUser.email);
      res.status(200).json({ accessToken });
    } else if (user.accessToken) res.status(200).json({ accessToken });
  } else {
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

    }

    let lastNum = allUser.slice(-1)[0].nickname;
    let lastId = allUser.slice(-1)[0]['_id'];
    let n = +lastNum.slice(6) + 1;

    if (n < 1000) {
      nickNum = (0.001 * n).toFixed(3).toString().slice(2);
      nickname = `Agent_${nickNum}`;
    } else {
      nickname = `Agent_${n}`;
    }

    const newUser = await User.create({
      _id: +lastId + 1,
      email: user.kakao_account.email,
      nickname,
      profileImg: user.properties.thumbnail_image || null,
    });
    const accessToken = jwtService.createAccessToken(newUser.email);
    res.status(201).json({ accessToken });
  }
});
*/

// 카카오 로그인(passport)
router.get('/api/auth/kakao', passport.authenticate('kakao'));

// 카카오 콜백(passport)
router.get(
  '/api/auth/kakao/callback',
  passport.authenticate('kakao', {
    successRedirect: '/',
    failureRedirect: '/api/login',
  }),
  (req, res) => {
    console.log('콜백api / req.user ===', req.user); // 로그인 후 이동할 페이지 (프론트 url)
    res.redirect('/');
  }
);

module.exports = router;
