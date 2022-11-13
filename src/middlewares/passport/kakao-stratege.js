const KakaoStrategy = require('passport-kakao').Strategy;
const { Db } = require('mongodb');
const passport = require('passport');
const { User } = require('../../schemas/user');
const jwtService = require('../../users/jwt');
require('dotenv').config();
const numFn = require('../../users/numFuntions');
const autoInc = numFn.autoIncrease;
let autoNum = autoInc();

module.exports = () =>
  passport.use(
    'kakao',
    new KakaoStrategy(
      {
        clientID: process.env.CLIENT_ID,
        callbackURL: process.env.CALLBACK_URL_PASSPORT, // 위에서 설정한 Redirect URI
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log('여기는 kakaoStratege.js');
        console.log('----------------------------');
        console.log(profile);
        console.log('profile.id :::', profile.id);
        console.log('profile.username :::', profile.username);
        console.log(
          'profile._json.connected_at :::',
          profile._json.connected_at
        );
        console.log(
          'profile._json.kakao_account.email :::',
          profile._json.kakao_account.email
        );
        console.log('----------------------------');

        /* 출력결과
        profile.id ::: 2519073484
        profile.username ::: 미뇽
        profile._json.connected_at ::: 2022-11-10T01:02:16Z
        profile._json.kakao_account.email ::: alsuddl25@naver.com
        */

        // 1. DB에 존재하는 유저인지 확인하기 (일단 가져오는 profile 정보 )
        let exUser = await User.findOne({
          email: profile._json.kakao_account.email,
        });

        // 2. 이미 가입된 카카오 프로필이면 성공
        if (exUser) {
          console.log(
            '여기는 kakaoStratege에서 가져온 profile의 정보가 DB에 있을 때!!'
          );
          console.log('exUser :::', exUser);

          const accessToken = await jwtService.createAccessToken(exUser._id);
          console.log('accessToken :::', accessToken);

          done(null, accessToken); // 로그인 인증 완료
        } else {
          // 3. DB에 존재하지 않는 유저라면 회원가입 후 로그인
          // 3-1. DB에 유저 정보 저장
          console.log('여기는 kakaoStratege 에서 유저가 없을 때! else');
          let nickNum, nickname, newUser;
          let allUser = await User.find();
          if (allUser.length === 0) {
            newUser = await User.create({
              _id: 1,
              email: profile._json.kakao_account.email,
              nickname: 'Agent_001',
              profileImg: profile._json.properties.thumbnail_image
                ? profile._json.properties.thumbnail_image
                : 'default',
            });
          } else {
            let lastNum = allUser.slice(-1)[0].nickname;
            let lastId = allUser.slice(-1)[0]['_id'];
            let n = +lastNum.slice(6) + 1;

            if (n < 1000) {
              nickNum = (0.001 * n).toFixed(3).toString().slice(2);
              nickname = `Agent_${nickNum}`;
            } else {
              nickname = `Agent_${n}`;
            }
            newUser = await User.create({
              _id: +lastId + 1,
              email: profile._json.kakao_account.email,
              nickname,
              profileImg: profile._json.properties.thumbnail_image
                ? profile._json.properties.thumbnail_image
                : 'default',
            });
          }

          const accessToken = await jwtService.createAccessToken(newUser._id);
          const decodedId = await jwtService.validateAccessToken(accessToken);

          console.log('------------토큰 발급 직후--------------');
          console.log('newUser accessToken :::', accessToken);
          console.log('decodeId :::', decodedId);

          done(null, accessToken); // 회원가입하고 로그인 인증 완료
        }
      }
    )
  );
