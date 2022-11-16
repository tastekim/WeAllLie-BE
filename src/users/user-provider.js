const UserRefo = require('./user-repo');
const jwtService = require('./jwt');
require('dotenv').config();

class UserProvider {
    kakaoCallback = async (req, res, next) => {
        // 카카오 Strategy에서 성공한다면 콜백 실행 (패스포트 사용시)
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

        console.log('--------------DB에서 유저 정보 가져와서 보낼 정보 가공 --------------');
        const userInfo = await this.getUserInfo(decodedId, accessToken);
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Authorization', accessToken);
        res.status(200).redirect('/user/kakao');
    };

    getKakaoToken = async (req, res, next) => {
        console.log('-------------------------------------------');
        console.log('여기는 user-provider.js 의 getKakaoToken!!!!!');
        console.log('전달받은 인가 코드 :::::::::::: ', req.query.code);

        const kakaoToken = await UserRefo.getKakaoToken(req.query.code);

        console.log('kakao에서 받아온 accessToken :::::::::::: ', kakaoToken);
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Content-Type', 'text/html; charset=utf-8');

        return res.send({ accessToken: kakaoToken });
    };

    /*
  1. 클라이언트에서 토큰 전달 받아서 카카오에 유저정보 요청
  2. DB의 유저정보와 비교하여 필요시 회원가입
  3. 유저정보 가공하여 클라이언트로 전달
    */
    getKakaoUserInfo = async (req, res, next) => {
        console.log('-------------------------------------------');
        console.log('여기는 user-provider.js 의 getKakaoUserInfo!!!!!');

        const { authorization } = req.headers;
        const [authType, kakaoToken] = (authorization || '').split(' ');

        // 토큰 카카오에 보내고 유저정보 받아오기
        const kakaoUserInfo = await UserRefo.getKakaoUserInfo(kakaoToken);

        console.log('kakaoToken:::::: ', kakaoToken);
        console.log('kakaoUserInfo::::::', kakaoUserInfo);

        // 카카오에서서 받은 유저정보에서 이메일로 DB에 저장된 유저 확인, 존재한다면 유저정보 가져오기 (undefinded일 수도.)
        // 유저가 존재한다면 전달할 형태로 Refo에서 가공되어져서 받아옴!!
        const exUserInfo = await this.exUserGetToken(kakaoUserInfo);

        // 1. 가입한 유저 => 토큰 + 유저정보 바로 전달
        if (exUserInfo) {
            console.log('user-route.js 4, exUserInfo:::::', exUserInfo);
            return res.status(200).json(exUserInfo);
        }
        // 2. 미가입 유저 => 회원가입 + 토큰발급 후 토큰 + 유저정보 전달
        const newUserInfo = await this.createUserToken(kakaoUserInfo);
        console.log('user-provider.js, newUserInfo::::::', newUserInfo);
        res.header('Autorization', `Bearer ${newUserInfo.accessToken}`);
        return res.status(201).json(newUserInfo);
    };

    /*
  미들웨어
  ===========================================================================
  메소드
  */
    // DB에 유저 정보 없음 => DB 저장 / 토큰발급 / 토큰 + 유저 게임정보 리턴
    createUserToken = async (kakaoUserInfo) => {
        console.log('-------------------------------------------');
        console.log('여기는 user-provider.js 의 createUserToken!!!!!');

        const allUser = await UserRefo.findAllUser();
        const newUser = await UserRefo.createNewUser(kakaoUserInfo, allUser);

        console.log('여기는 user-provider.js 3, newUser::::::', newUser);

        // 새로 생셩한 newUser에게 _id 값으로 토큰 발급
        const newUserToken = await jwtService.createAccessToken(newUser._id);

        // 클라이언트에 전달하기 위해 유저 정보 가공
        const playRecord = await UserRefo.getPlayRecord(newUser, newUserToken);

        return playRecord;
    };

    getUserInfo = async (decodedId, accessToken) => {
        const exUser = await findOneById(decodedId);
        console.log('-------------------------------------------');
        console.log('여기는 user-provider.js 의 getUserInfo!!!!!');
        console.log('exUser::::::', exUser);

        const playRecord = await UserRefo.getPlayRecord(exUser, accessToken);
        return playRecord;
    };

    exUserGetToken = async (kakaoUserInfo) => {
        // 존재하는 유저일 경우 토큰 발급하여 가져오기
        console.log('-------------------------------------------');
        console.log('여기는 user-provider.js 의 exUserGetToken!!!!!');

        const exUser = await UserRefo.findOneByEmail(kakaoUserInfo.kakao_account.email);
        console.log('exUserGetToken 1, exUser:::::: ', exUser);

        if (exUser) {
            const accessToken = await jwtService.createAccessToken(exUser._id);
            console.log('exUserGetToken 2, accessToken::::::', accessToken);

            const playRecord = await UserRefo.getPlayRecord(exUser, accessToken);
            return playRecord;
        } else return;
    };
}

module.exports = new UserProvider();

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
