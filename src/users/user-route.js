const express = require('express');
const router = express.Router();
const UserController = require('./user-controller');
const wrapAsync = require('./util/wrap-async');

// 카카오 로그인 1 : 클라이언트에서 인가코드 전달 받음 =>  카카오로 토큰 요청 =>  클라이언트에 카카오 토큰 전달
router.get('/api/auth/kakao/callback', wrapAsync(UserController.getKakaoToken));

// 카카오 로그인 2 : 토큰으로 카카오에 유저정보 전달하여 클라이언트에 새 토큰 + 유저정보 전달
router.post('/api/auth/kakao/callback', wrapAsync(UserController.getKakaoToken));

module.exports = router;
