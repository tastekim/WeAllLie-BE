const { User } = require('../schemas/user');
const UserRefo = require('./user-repo');
const jwtService = require('./jwt');
require('dotenv').config();

/* 예시
  user-route.js 1, res.locals에 저장한 userInfo:::::: {
    id: 2519073484,
    connected_at: '2022-11-10T01:02:16Z',
    properties: { nickname: '미뇽' },
    kakao_account: {
      profile_nickname_needs_agreement: false,
      profile_image_needs_agreement: true,
      profile: { nickname: '미뇽' },
      has_email: true,
      email_needs_agreement: false,
      is_email_valid: true,
      is_email_verified: true,
      email: 'alsuddl25@naver.com'
    }
  }
*/

class UserProvider {
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

      console.log('spyWinRating', spyWinRating);
      console.log('voteSpyRating', voteSpyRating);

      return {
        accessToken,
        userId: exUser._id,
        nickname: exUser.nickname,
        profileImg: exUser.profileImg,
        totayPlayCount: exUser.totalCount,
        spyPlayCount: exUser.spyPlayCount,
        ctzPlayCount: exUser.totalCount - exUser.spyPlayCount,
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

    console.log('spyWinRating', spyWinRating);
    console.log('voteSpyRating', voteSpyRating);
    return {
      accessToken: newUserToken,
      userId: newUser._id,
      nickname: newUser.nickname,
      profileImg: newUser.profileImg,
      totayPlayCount: newUser.totalCount,
      spyPlayCount: newUser.spyPlayCount,
      ctzPlayCount: newUser.totalCount - newUser.spyPlayCount,
      spyWinRating,
      voteSpyRating,
    };
  };

  getUserInfo = async (decodedId, accessToken) => {
    const exUser = await User.findOne({
      _id: decodedId,
    });
    console.log('여기는 user-provider.js, getUserInfo, exUser:::', exUser);
    let spyWinRating, voteSpyRating, totalCount;
    if (exUser.totalCount === 0) {
      spyWinRating = 0;
      voteSpyRating = 0;
    } else if (exUser.spyPlayCount === 0) {
      spyWinRating = 0;
    } else if (exUser.totalCount - exUser.spyPlayCount === 0) {
      voteSpyRating = 0;
    }

    spyWinRating = (exUser.spyWinCount / exUser.spyPlayCount).toFixed(2) * 100;
    voteSpyRating =
      (exUser.voteSpyCount / (exUser.totalCount - exUser.spyPlayCount)).toFixed(
        2
      ) * 100;

    console.log('spyWinRating', spyWinRating);
    console.log('voteSpyRating', voteSpyRating);

    return {
      accessToken,
      userId: exUser._id,
      nickname: exUser.nickname,
      profileImg: exUser.profileImg,
      totayPlayCount: exUser.totalCount,
      spyPlayCount: exUser.spyPlayCount,
      ctzPlayCount: exUser.totalCount - exUser.spyPlayCount,
      spyWinRating,
      voteSpyRating,
    };
  };
  kakaoCallback = async (req, res, next) => {
    //카카오 Strategy에서 성공한다면 콜백 실행
    // 토큰 생성 및 유저 정보 가공해서 전달하기
    console.log('-------------------------------------------');
    console.log('여기는 user-provider.js 의 kakaoCallbace!!!!!');
    console.log('전달받은 req.user::::::', req.user);
    const accessToken = await req.user;
    const decodedId = await jwtService.validateAccessToken(accessToken);

    console.log('------------토큰 값 및 디코딩 결과--------------');
    console.log('accessToken ::::::::::::', accessToken);
    console.log('decodeId ::::::::::::', decodedId);

    console.log(
      '--------------DB에서 유저 정보 가져와서 보낼 정보 가공 >> 로직 파일 분리 예정--------------'
    );
    const userInfo = await this.getUserInfo(decodedId, accessToken);
    res.header('Access-Control-Allow-Origin', '*');
    res.send(userInfo);
  };
}

module.exports = new UserProvider();
