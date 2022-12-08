const express = require('express');
const router = express.Router();
const UserProvider = require('./user-provider');
const authMiddleware = require('../middlewares/auth-middleware');

// 카카오 로그인 1 : 클라이언트에서 인가코드 전달 받음 =>  카카오로 토큰 요청 =>  클라이언트에 카카오 토큰 전달
router.get('/api/auth/kakao/callback', UserProvider.getKakaoToken);

// 카카오 로그인 2 : 토큰으로 카카오에 유저정보 전달하여 클라이언트에 새 토큰 + 유저정보 전달
router.post('/api/auth/kakao/callback', UserProvider.getKakaoUserInfo);

// 유저 정보 조회
router.get('/api/user', authMiddleware, UserProvider.getUserRecord);

// 닉네임 변경
router.put('/api/user', authMiddleware, UserProvider.updateNick);

module.exports = router;
