const passport = require('passport');
const express = require('express');
const router = express.Router();
const axios = require('axios');
const qs = require('qs');

const loginMiddleware = require('../middlewares/login-middleware');
const UserProvider = require('./user-provider');

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

  let user = await axios({
    method: 'get',
    url: 'https://kapi.kakao.com/v2/user/me',
    headers: {
      Authorization: `Bearer ${kakaoToken.data.access_token}`,
    },
  });
  console.log(user);
  /*
  user.properties.profile_image
  user.properties.thumbnail_image
  user.properties.nickname
  user.kakao_account.email
  */

  // loginMiddleware 를 거칠 때, 이미 유효한 토큰을 가지고 있는 유저라면(로그인한 유저)
  // 기존 토큰값을 res.locals.user.accessToken에 저장된다.
  // res.locals.user.accessToken 값이 존재하면 그 토큰 그대로 전달
  const existToken = res.locals.user.accessToken;
  if (existToken) return res.status(200).json({ accessToken: existToken });

  // res.locals.user.accessToken 이 존재하지 않는 경우 1,2
  // 1. 가입은 되어 있으나 토큰 만료 => 토큰 재발급하여 전달
  const exUserGetToken = UserProvider.exUserGetToken(user);
  if (exUserGetToken)
    return res.status(200).json({ accessToken: exUserGetToken });

  // 2. 미가입 유저 => 회원가입 + 토큰발급 후 토큰 전달
  const newUserToken = UserProvider.createUserToken(user);
  return res.status(201).json({ accessToken: newUserToken });
});

/*





















*/
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
