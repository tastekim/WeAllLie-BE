const authMiddleware = require('../middlewares/auth-middleware');
const passport = require('passport');
const express = require('express');
const router = express.Router();
const qs = require('qs');

require('dotenv').config();

// 카카오 로그인 후 성공 시 redirect 되는 URL
router.get('/', (req, res) => {
  console.log(req.user);
  console.log(req);
  return res.send(req.user);
});

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
    res.json(req.user);
  }
);

module.exports = router;
