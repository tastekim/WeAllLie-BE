const express = require('express');
const authMiddleware = require('../middlewares/auth-middleware');
const router = express.Router();
// 로그인 미들웨어 현재 미사용
// const loginMiddleware = require('../middlewares/login-middleware');
const UserProvider = require('./user-provider');
// const loginMiddleware = require('../middlewares/login-middleware');

// 카카오 로그인 1 : 클라이언트에서 인가코드 전달 받음 =>  카카오로 토큰 요청 =>  클라이언트에 카카오 토큰 전달
router.get('/api/auth/kakao/callback', /* loginMiddleware,*/ UserProvider.getKakaoToken);

// 카카오 로그인 2 : 토큰으로 카카오에 유저정보 전달하여 클라이언트에 새 토큰 + 유저정보 전달
router.post('/api/auth/kakao/callback', /* loginMiddleware,*/ UserProvider.getKakaoUserInfo);

module.exports = router;
