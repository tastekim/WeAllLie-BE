const passport = require('passport');
const express = require('express');
const router = express.Router();
const qs = require('qs');

require('dotenv').config();

// 카카오 로그인(passport)
router.get('/api/kakao', passport.authenticate('kakao'));

// 카카오 콜백(passport)
router.get(
  '/api/auth/kakao/callback',
  passport.authenticate('kakao', {
    failureRedirect: '/api/login',
  }),
  (req, res) => {
    res.redirect('/'); // 로그인 후 이동할 페이지 (미정)
  }
);

module.exports = router;
