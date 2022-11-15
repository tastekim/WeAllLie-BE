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
  exUserGetToken = async (email) => {
    // 존재하는 유저일 경우 토큰 발급하여 가져오기
    const exUser = await User.findOne({
      email: kakaoUserData.kakao_account.email,
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

  createUserToken = async (kakaoUserInfo) => {
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
      email: kakaoUserInfo.kakao_account.email,
      profileImg: kakaoUserInfo.properties.thumbnail_image
        ? kakaoUserInfo.properties.thumbnail_image
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
    console.log('세션 req.session::::::', req.session);
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
    res.header('Authorization', accessToken);
    res.status(200).redirect('/user/kakao');
  };

  getKakaoToken = async (req, res, next) => {
    console.log('-------------------------------------------');
    console.log('여기는 user-provider.js 의 getKakaoToken!!!!!');
    let code = req.query.code;
    console.log('전달받은 인가 코드 :::::::::::: ', code);

    const kakaoToken = await axios({
      method: 'POST',
      url: 'https://kauth.kakao.com/oauth/token',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: qs.stringify({
        grant_type: 'authorization_code',
        client_id: process.env.CLIENT_ID,
        redirectUri: process.env.CALLBACK_URL_LOCAL,
        code: req.query.code,
      }),
    });

    console.log(
      'kakao에서 받아온 accessToken :::::::::::: ',
      kakaoToken.data.access_token
    );
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Authorization', kakaoToken.data.access_token);
    return res.send({ accessToken: kakaoToken.data.access_token });
  };

  getKakaoUserInfo = async (req, res, next) => {
    /*
    1. 클라이언트에서 토큰 전달 받음
    2. 토큰으로 카카오에 유저정보 요청
    3. DB의 유저정보와 비교하여 필요시 회원가입
    4. 유저정보 가공하여 클라이언트로 전달
     */
    const { authorization } = req.headers;
    const [authType, kakaoToken] = (authorization || '').split(' ');

    const kakaoResult = await axios({
      method: 'get',
      url: 'https://kapi.kakao.com/v2/user/me',
      headers: {
        Authorization: `Bearer ${kakaoToken}`,
      },
    });

    const kakaoUserData = kakaoResult.data;
    console.log(
      '------------여기는 user-provider.js의 getKakaoUserInfo---------------'
    );
    console.log('kakaoToken:::', kakaoToken.data);
    console.log('kakaoUserData:::', kakaoUserData);

    const exUserInfo = await this.exUserGetToken(kakaoUserData);

    // 1. 가입한 유저 => 토큰 + 유저정보 바로 전달
    if (exUserInfo) {
      console.log('user-route.js 4, exUserInfo:::::', exUserInfo);
      return res.status(200).json(exUserInfo);
    }
    // 2. 미가입 유저 => 회원가입 + 토큰발급 후 토큰 + 유저정보 전달
    const newUserInfo = await this.createUserToken(kakaoUserData);
    console.log('user-route.js 5, newUserToken::::::', newUserInfo);
    return res.status(201).json(newUserInfo);
  };
}

module.exports = new UserProvider();
