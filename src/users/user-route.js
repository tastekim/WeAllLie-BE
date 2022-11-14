const passport = require('passport');
const express = require('express');
const router = express.Router();

const loginMiddleware = require('../middlewares/login-middleware');
const UserProvider = require('./user-provider');

// 카카오 로그인 : g인가코드 받고 카카오로 유저 정보 요청하여 받아오기 => 로그인/회원가입/토큰 발급
router.get('/api/auth/kakao/callback', async (req, res) => {
  console.log('user-route.js 1, 인가코드::::::', req.query.code);

  let kakaoToken = await UserProvider.getKakaoToken(req);
  let userInfo = await UserProvider.getUserInfo(kakaoToken);

  console.log('user-route.js 2, kakaoToken::::::', kakaoToken);
  console.log('user-route.js 3, userInfo::::::', userInfo);

  // loginMiddleware 를 거칠 때, 이미 유효한 토큰을 가지고 있는 유저라면(로그인한 유저)
  // 기존 토큰값이 res.locals.user.accessToken에 저장된다. 값이 존재하면 그대로 전달
  // const existToken = res.locals.user.accessToken;
  // if (existToken) return res.status(200).json({ accessToken: existToken });

  // res.locals.user.accessToken 이 존재하지 않는 경우 1,2
  // 1. 가입은 되어 있으나 토큰 만료 => 토큰 재발급하여 전달
  const exUserGetToken = await UserProvider.exUserGetToken(userInfo);
  if (exUserGetToken) {
    console.log('user-route.js 4, exUserGetToken::::::', exUserGetToken);
    return res.status(200).json({ accessToken: exUserGetToken });
  }
  // 2. 미가입 유저 => 회원가입 + 토큰발급 후 토큰 전달
  const newUserToken = await UserProvider.createUserToken(userInfo);
  console.log('user-route.js 5, newUserToken::::::', newUserToken);
  return res.status(201).json({ accessToken: newUserToken });
});

router.get('/auth/kakao/callback');

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
router.get('/', loginMiddleware, async (req, res) => {
  const { user } = res.locals;
  console.log('여기가 패스포트 마지막 단계(req.user.accessToken)');
  console.log('user:::::::::::::::', user);
  res.json({ user });
});

module.exports = router;
