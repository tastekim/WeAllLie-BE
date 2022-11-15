const { User } = require('../schemas/user');
const jwtService = require('./jwt');
require('dotenv').config();

class UserRefo {
  exUserGetToken = async (kakaoUserData) => {
    // 존재하는 유저일 경우 토큰 발급하여 가져오기
    const exUser = await User.findOne({
      email: kakaoUserData.kakao_account.email,
    });
    console.log('여기는 user-repo.js 1, exUserGetToken, exUser:::', exUser);
    if (exUser) {
      const accessToken = await jwtService.createAccessToken(exUser._id);
      console.log('여기는 user-repo.js 2, accessToken::::::', accessToken);
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

  createUserToken = async (kakaoUserData) => {
    // DB에 유저 정보 없음 => 회원가입 / 토큰발급 / 토큰리턴
    console.log('여기는 user-provider.js 2, createUserToken');

    let nickNum, nickname, _id;
    let allUser = await User.find();

    // DB에 유저가 하나도 없다면 초기값 세팅
    if (allUser.length === 0) {
      _id = 1;
      nickname = 'Agent_001';
    } else {
      // DB에 유저가 있을 경우
      const lastNum = allUser.slice(-1)[0].nickname; // 마지막 document 의 nickname
      let n = +lastNum.slice(6) + 1; // nickname 에서 Agent_ 뒷부분만 가져온 후 Number 변환
      // n이 1000이상이면 Agent_ 뒤에 그대로 붙이고, 1000보다 작으면 001 의 형태로 붙이기
      if (n < 1000) {
        nickNum = (0.001 * n).toFixed(3).toString().slice(2);
        nickname = `Agent_${nickNum}`;
      } else {
        nickname = `Agent_${n}`;
      }
      nickname = nickname;
    }
    // 위에서 만든 값으로 newUser DB 에 저장하기
    const newUser = await User.create({
      _id: +nickNum,
      nickname,
      email: kakaoUserData.kakao_account.email,
      profileImg: kakaoUserData.properties.thumbnail_image
        ? kakaoUserData.properties.thumbnail_image
        : 'default',
    });

    console.log('여기는 user-provider.js 3, newUser::::::', newUser);

    // 새로 생셩한 newUser에게 _id 값으로 토큰 발급
    const newUserToken = await jwtService.createAccessToken(newUser._id);

    // 클라이언트에 전달하기 위해 유저 정보 가공
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

    // 전부 0일 때 자꾸 NaN 으로 나온다.
    console.log('spyWinRating', spyWinRating);
    console.log('voteSpyRating', voteSpyRating);

    // 최종적으로 클라이언트에 넘겨주는 정보
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
}

module.exports = new UserRefo();
