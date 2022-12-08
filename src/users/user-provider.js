const UserRepo = require('./user-repo');
const UserService = require('./user-service');
const UserFunction = require('../users/util/user-function');
const { UserError, UnKnownError } = require('../middlewares/exception');
require('dotenv').config();

class UserProvider {
    getKakaoToken = async (req, res, next) => {
        try {
            console.log('전달받은 인가 코드 :::::::::::: ', req.query.code);

            const kakaoToken = await UserService.getKakaoToken(req.query.code);
            console.log('kakao에서 받아온 accessToken ::: ', kakaoToken);

            res.header('Access-Control-Allow-Origin', '*');
            res.header('Content-Type', 'text/html; charset=utf-8');

            return res.send({ accessToken: kakaoToken });
        } catch (e) {
            return res.send({ errorMessage: e.message });
        }
    };

    /*
  1. 클라이언트에서 토큰 전달 받아서 카카오에 유저정보 요청
  2. DB의 유저정보와 비교하여 필요시 회원가입
  3. 유저정보 가공하여 클라이언트로 전달 => 토큰 + 닉네임 전달
    */
    getKakaoUserInfo = async (req, res, next) => {
        console.log('-------------------------------------------');
        console.log('여기는 user-provider.js 의 getKakaoUserInfo!!!!!');

        const { authorization } = req.headers;
        const [authType, kakaoToken] = (authorization || '').split(' ');
        try {
            if (!kakaoToken) throw new UserError('헤더에 토큰이 존재하지 않습니다.', 400);
            if (!authType || authType !== 'Bearer')
                throw new UserError('authorization 헤더 타입이 올바르지 않습니다.', 400);

            // 토큰 카카오에 보내고 유저정보 확인하여 회원가입/로그인 후 서버에서 발급한 accessToken + 유저 정보 받아오기
            const exUserInfo = await UserService.getAccessToken(kakaoToken);
            return res.status(200).json(exUserInfo);
        } catch (e) {
            return res.send({ errorMessage: e.message });
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
            return res.send({ errorMessage: e.message });
        }
    };

    // 닉네임 변경
    updateNick = async (req, res) => {
        try {
            const { user } = res.locals;
            const { nickname } = req.body;
            const isExistNick = await UserRepo.findOneByNickname(nickname);
            if (isExistNick) throw new UserError('닉네임 중복', 400);
            await UserRepo.updateNick(user._id, nickname);

            return res.status(200).json({ nickname });
        } catch (e) {
            return res.send({ errorMessage: e.message });
        }
    };
}

module.exports = new UserProvider();
