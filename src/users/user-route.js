const express = require('express');
const router = express.Router();
const qs = require('qs');
const axios = require('axios');
const { User } = require('../schemas/user');
const jwt = require('jsonwebtoken');

require('dotenv').config();

// 카카오 로그인 후 성공 시 redirect 되는 URL
router.get('/', (req, res) => {
    console.log(req.user);
    return res.send(req.user);
});

// 카카오 인가코드 받고 카카오에서 유저 정보 받아와서 전달
router.get('/api/auth/kakao/callback', async (req, res) => {
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

    /*
  user.properties.profile_image
  user.properties.thumbnail_image
  user.properties.nickname
  user.kakao_account.email
  _id  or  id 인지 확인
  */
    let exUser = await User.findOne({
        email: user.kakao_account.email,
    });

    // DB 의 유저 정보 확인하여 회원 가입 & 로그인 & 토큰 생성
    if (exUser) {
        console.log('exUser :::', exUser);

        const token = jwt.sign({ email: exUser.email }, process.env.SECRET_KEY, {
            expiresIn: '1h',
        });

        res.status(200).json({ token });
    } else {
        let nickNum, nickname;
        let allUser = await User.find();
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
        const token = jwt.sign({ email: newUser.email }, process.env.SECRET_KEY, {
            // 토큰 만료시간 1시간으로 설정. 테스트를 위해.. (나중에 줄여줄 것!)
            expiresIn: '1h',
        });
        res.status(201).json({ token });
    }
});

/*
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
*/

module.exports = router;
