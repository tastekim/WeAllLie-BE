const KakaoStrategy = require('passport-kakao').Strategy;
const passport = require('passport');
const mongoose = require('mongoose');
// const { User } = require('../schemas');
require('dotenv').config();

module.exports = () =>
  passport.use(
    'kakao',
    new KakaoStrategy(
      {
        clientID: process.env.CLIENT_ID,
        callbackURL: process.env.CALLBACK_URL, // 위에서 설정한 Redirect URI
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log('여기는 kakaoStratege.js');
          // 1. DB에 존재하는 유저인지 확인하기(미구현 : DB 설계 전)
          const exUser = '';
          // 2. 이미 가입된 카카오 프로필이면 성공
          if (exUser) {
            done(null, exUser); // 로그인 인증 완료
          } else {
            // 3. DB에 존재하지 않는 유저라면 회원가입 후 로그인 (미구현 : DB 설계 전)
            // 3-1. DB에 유저 정보 저장
            // const newUser = await User.create();
            // exception.whenSignUp(newUser.authId); // ??
            done(null, profile); // 회원가입하고 로그인 인증 완료
          }
        } catch (error) {
          console.error(error); // 에러 핸들러 구현 필요
          done(error);
        }
        console.log(profile);
        done(null, profile);
      }
    )
  );
