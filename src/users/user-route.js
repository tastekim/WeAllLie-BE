const passport = require('passport');
const express = require('express');
const router = express.Router();

const loginMiddleware = require('../middlewares/login-middleware');
const kakaoMiddleware = require('../middlewares/kakao-middleware');
const UserProvider = require('./user-provider');

// 카카오 로그인 1 : 클라이언트에서 인가코드 전달 받음 =>  카카오로 토큰 요청 =>  클라이언트에 카카오 토큰 전달
router.get('/api/auth/kakao/callback', UserProvider.getKaKaoToken);

// 카카오 로그인 2 : 토큰으로 카카오에 유저정보 전달하여 클라이언트에 새 토큰 + 유저정보 전달
router.post('/api/auth/kakao/callback', UserProvider.getKaKaoUserInfo);

/*





















*/

/*
// PASSPORT 로그인
// 카카오 로그인(passport)
router.get('/api/auth/kakao', passport.authenticate('kakao'));

//카카오 콜백(passport)
router.get(
  '/api/auth/kakao/callback',
  passport.authenticate('kakao', {
    failureRedirect: '/',
  }),
  UserProvider.kakaoCallback
);

// 카카오 로그인 후 성공 시 redirect 되는 URL
router.get('/user/kakao', async (req, res) => {
  const userSessionId = req.session;
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Authorization', accessToken);
  return;
});
*/

module.exports = router;
