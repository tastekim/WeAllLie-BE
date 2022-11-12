const authMiddleware = require('../middlewares/auth-middleware');
const passport = require('passport');
const express = require('express');
const router = express.Router();
const qs = require('qs');
const axios = require('axios');

require('dotenv').config();

// 카카오 로그인 후 성공 시 redirect 되는 URL
router.get('/', (req, res) => {
  console.log(req.user);
  return res.send(req.user);
});

// 카카오 로그인(passport)
router.get('/api/auth/kakao', passport.authenticate('kakao'));

// 카카오 콜백(passport)
// router.get(
//   '/api/auth/kakao/callback',
//   passport.authenticate('kakao', {
//     successRedirect: '/',
//     failureRedirect: '/api/login',
//   }),
//   (req, res) => {
//     console.log('콜백api / req.user ===', req.user); // 로그인 후 이동할 페이지 (프론트 url)
//     res.redirect('/');
//   }
// );

router.get('/api/auth/kakao/callback', async (req, res) => {
  console.log(req.query.code);
  let token = await axios({
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
  console.log(token);
  user = await axios({
    method: 'get',
    url: 'https://kapi.kakao.com/v2/user/me',
    headers: {
      Authorization: `Bearer ${token.data.access_token}`,
    },
  });
  console.log(user);

  req.session.kakao = user.data;
  res.send('success');
});

module.exports = router;
