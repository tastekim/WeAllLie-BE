const passport = require('passport');
const express = require('express');
const router = express.Router();

const loginMiddleware = require('../middlewares/login-middleware');
const UserProvider = require('./user-provider');

<<<<<<< HEAD
// 카카오 로그인 1 : 클라이언트에서 인가코드 전달 받음 =>  카카오로 토큰 요청 =>  클라이언트에 카카오 토큰 전달
router.get('/api/auth/kakao/callback', UserProvider.getKakaoToken);

// 카카오 로그인 2 : 토큰으로 카카오에 유저정보 전달하여 클라이언트에 새 토큰 + 유저정보 전달
router.post('/api/auth/kakao/callback', UserProvider.getKakaoUserInfo);
=======
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
>>>>>>> master

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
