const { User } = require('../schemas/user');
const UserRefo = require('./user-repo');
const jwtService = require('./jwt');
const axios = require('axios');
const qs = require('qs');
require('dotenv').config();

/*
  user.properties.profile_image
  user.properties.thumbnail_image
  user.properties.nickname
  user.kakao_account.email
  */

class UserProvider {
  getKakaoToken = async (req) => {
    return await axios({
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
  };

  getUserInfo = async (kakaoToken) => {
    const result = await axios({
      method: 'get',
      url: 'https://kapi.kakao.com/v2/user/me',
      headers: {
        Authorization: `Bearer ${kakaoToken.data.access_token}`,
      },
    });
    return result.data;
  };

  exUserGetToken = async (userInfo) => {
    const exUser = await User.findOne({
      email: userInfo.kakao_account.email,
    });
    console.log('여기는 user-provider.js 1, exUserGetToken, exUser:::', exUser);
    if (exUser) {
      const accessToken = await jwtService.createAccessToken(exUser._id);
      console.log('여기는 user-provider.js 2, accessToken::::::', accessToken);
      let spyWinRating, voteSpyRating, totalCount;
      if (exUser.totalCount === 0) {
        spyWinRating = 0;
        voteSpyRating = 0;
      } else if (exUser.spyPlayCount === 0) {
        spyWinRating = 0;
      } else if (exUser.totalCount - exUser.spyPlayCount === 0) {
        voteSpyRating = 0;
      }

      spyWinRating =
        (exUser.spyWinCount / exUser.spyPlayCount).toFixed(2) * 100;
      voteSpyRating =
        (
          exUser.voteSpyCount /
          (exUser.totalCount - exUser.spyPlayCount)
        ).toFixed(2) * 100;

      return {
        accessToken,
        userId: exUser._id,
        nickname: exUser.nickname,
        profileImg: exUser.profileImg,
        totayPlayCount: totalCount,
        spyWinRating,
        voteSpyRating,
      };
    } else return;
  };

  createUserToken = async (userInfo) => {
    // DB에 유저 정보 없음 => 회원가입 / 토큰발급 / 토큰리턴
    console.log('user-provider.js 3');
    let nickNum, nickname, _id;
    let allUser = await User.find();

    if (allUser.length === 0) {
      _id = 1;
      nickname = 'Agent_001';
    } else {
      let lastNum = allUser.slice(-1)[0].nickname;
      let n = +lastNum.slice(6) + 1;

      if (n < 1000) {
        nickNum = (0.001 * n).toFixed(3).toString().slice(2);
        nickname = `Agent_${nickNum}`;
      } else {
        nickname = `Agent_${n}`;
      }
      nickname = nickname;
    }

    const newUser = await User.create({
      _id: +nickNum,
      nickname,
      email: userInfo.kakao_account.email,
      profileImg: userInfo.properties.thumbnail_image
        ? userInfo.properties.thumbnail_image
        : 'default',
    });

    console.log('user-provider.js 4, newUser._id::::::', newUser);
    const newUserToken = await jwtService.createAccessToken(newUser._id);
    let spyWinRating, voteSpyRating, totalCount;
    if (newUser.totalCount === 0) {
      spyWinRating = 0;
      voteSpyRating = 0;
    } else if (newUser.spyPlayCount === 0) {
      spyWinRating = 0;
    } else if (newUser.totalCount - newUser.spyPlayCount === 0) {
      voteSpyRating = 0;
    }

    spyWinRating =
      (newUser.spyWinCount / newUser.spyPlayCount).toFixed(2) * 100;
    voteSpyRating =
      (
        newUser.voteSpyCount /
        (newUser.totalCount - newUser.spyPlayCount)
      ).toFixed(2) * 100;

    return {
      accessToken: newUserToken,
      userId: newUser._id,
      nickname: newUser.nickname,
      profileImg: newUser.profileImg,
      totayPlayCount: totalCount,
      spyWinRating,
      voteSpyRating,
    };
  };
}

module.exports = new UserProvider();
