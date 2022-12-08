const UserRepo = require('./user-repo');
const UserService = require('./user-service');
const UserFunction = require('../users/util/user-function');
const { UserError } = require('../middlewares/exception');
require('dotenv').config();

class UserProvider {
    getKakaoToken = async (req, res) => {
        console.log('전달받은 인가 코드 :::::::::::: ', req.query.code);
        const kakaoToken = await UserService.getKakaoToken(req.query.code);
        console.log('kakao에서 받아온 accessToken :::::::::::: ', kakaoToken);

        res.header('Access-Control-Allow-Origin', '*');
        res.header('Content-Type', 'text/html; charset=utf-8');

        return res.send({ accessToken: kakaoToken });
    };

    /*
  1. 클라이언트에서 토큰 전달 받아서 카카오에 유저정보 요청
  2. DB의 유저정보와 비교하여 필요시 회원가입
  3. 유저정보 가공하여 클라이언트로 전달 => 쿠키로 토큰 전달 / 바디로 닉네임만 전달
    */
    getKakaoUserInfo = async (req, res) => {
        console.log('-------------------------------------------');
        console.log('여기는 user-provider.js 의 getKakaoUserInfo!!!!!');

        try {
            const { authorization } = req.headers;
            const [authType, kakaoToken] = (authorization || '').split(' ');
            if (!authType || authType !== 'Bearer')
                throw new UserError('authrization 헤더 타입 인증 실패', 400);
            if (!kakaoToken) throw new UserError('카카오 토큰이 헤더에 없습니다.', 400);

            // 토큰 카카오에 보내고 유저정보 받아오기
            const kakaoUserInfo = await UserService.getKakaoUserInfo(kakaoToken);

            console.log('kakaoToken:::::: ', kakaoToken);
            console.log('kakaoUserInfo::::::', kakaoUserInfo);

            // 카카오에서서 받은 유저정보에서 이메일로 DB에 저장된 유저 확인, 존재한다면 유저정보 가져오기 (undefinded일 수도.)
            const exUserInfo = await UserService.exUserGetToken(kakaoUserInfo);

            // 1. 가입한 유저 => 토큰 + 유저정보 바로 전달
            if (exUserInfo) {
                console.log('user-route.js 4, exUserInfo:::::', exUserInfo);
                console.log('--------------------------------------------');
                // await redis.set(refreshToken, payload.userId, { EX: 3600*24, NX: true });

                return res.status(200).json({
                    accessToken: exUserInfo.accessToken,
                    nickname: exUserInfo.nickname,
                    spyWinRating: exUserInfo.spyWinRating,
                    voteSpyRating: exUserInfo.voteSpyRating,
                });
            }
            // 2. 미가입 유저 => 회원가입 + 토큰발급 후 토큰 + 유저정보 전달
            const newUserInfo = await UserService.createUserToken(kakaoUserInfo);
            console.log('user-provider.js, newUserInfo:::', newUserInfo);

            return res.status(201).json({
                nickname: newUserInfo.nickname,
                accessToken: newUserInfo.accessToken,
                spyWinRating: 0,
                voteSpyRating: 0,
            });
        } catch (e) {
            console.log(e);
            if (e.name === 'UserError') {
                res.status(e.statusCode).send({ errorMessage: e.message });
            } else {
                res.status(500).send({ errorMessage: e.message });
            }
        }
    };

    // 유저 정보 조회
    getPlayRecord = async (req, res) => {
        try {
            console.log('res.locals.user:: ', res.locals.user);
            const { user } = res.locals;
            const exUser = await UserRepo.findOneById(user._id);
            const userInfo = await UserFunction.getPlayRecord(exUser);
            console.log('유저 정보 전적으로 가공 후 !! userInfo ::', userInfo);
            return res.status(200).json(userInfo);
        } catch (e) {
            console.log(e);
            res.status(500).send({ errorMessage: e.message });
        }
    };

    // 닉네임 변경
    updateNick = async (req, res) => {
        try {
            const { user } = res.locals;
            const { nickname } = req.body;
            const isExistNick = await UserRepo.findOneByNickname(nickname);
            if (isExistNick) {
                return res.status(400).json({ errorMessage: '닉네임 중복' });
            }
            await UserRepo.updateNick(user._id, nickname);
            return res.status(200).json({ nickname });
        } catch (e) {
            console.log(e);
            res.status(500).json({ errorMessage: e.message });
        }
    };

    /*
  미들웨어
  ===========================================================================
  메소드
  */
}

module.exports = new UserProvider();
