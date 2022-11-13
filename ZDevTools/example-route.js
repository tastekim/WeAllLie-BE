const express = require('express');
const authRouter = express.Router();
const authController = require('../controllers/auth.controller');
const passport = require('passport');

const { isLoggedIn, isNotLoggedIn } = require('./middlewares/authMiddle');

// 회원가입(/api/auth/signup)
authRouter.post('/signup', isNotLoggedIn, authController.localSignUp);

// 이메일 확인(/api/auth/checkEmail?email)
authRouter.get('/checkEmail', isNotLoggedIn, authController.checkEmail);

// 인증번호 발송(/api/auth/sendEmail)
authRouter.post('/sendEmail', authController.sendEmail);

// 인증번호 확인(/api/auth/check-authnum?=123456&email=lsb@lsb.com)
authRouter.get('/check-authnum', authController.checkAuthNum);

// 비밀번호 변경(/api/auth/updatePw?email)
authRouter.put('/updatePw', authController.updatePw);

// 닉네임 확인(/api/auth/checkNickname?nickname)
authRouter.get('/checkNickname', isLoggedIn, authController.checkNickname);

// 닉네임/나이/성별 추가(/api/auth/detail)
authRouter.post('/detail', isLoggedIn, authController.updateNicknameAgeGender);

// 로컬로그인(/api/auth/login)
authRouter.post('/login', isNotLoggedIn, authController.localLogin);

//카카오 로그인(/api/auth/kakao)
authRouter.get('/kakao', isNotLoggedIn, passport.authenticate('kakao'));

//카카오 콜백(/api/auth/kakao/callback)
authRouter.get(
  '/kakao/callback',
  isNotLoggedIn,
  passport.authenticate('kakao', {
    failureRedirect: '/',
  }),
  authController.kakaoCallback
);
authRouter.get('/kakao/disconnect');

// 로그아웃(/api/auth/logout)
authRouter.delete('/logout', isLoggedIn, authController.logout);

module.exports = authRouter;
