const UserService = require('./user-service');
const { UserError } = require('../middlewares/exception');
require('dotenv').config();

class UserController {
    // 인가코드로 카카오 토큰 받아오기
    getKakaoToken = async (req, res) => {
        console.log('전달받은 인가 코드 :::::::::::: ', req.query.code);
        const kakaoToken = await UserService.getKakaoToken(req.query.code);
        console.log('kakao에서 받아온 accessToken :::::::::::: ', kakaoToken);

        // res.header('Access-Control-Allow-Origin', '*');
        // res.header('Content-Type', 'text/html; charset=utf-8');

        return res.status(200).send({ accessToken: kakaoToken });
    };

    /*
  1. 클라이언트에서 토큰 전달 받아서 카카오에 유저정보 요청
  2. DB의 유저정보와 비교하여 필요시 회원가입
  3. 유저정보 가공하여 클라이언트로 전달 => 쿠키로 토큰 전달 / 바디로 닉네임만 전달
    */
    // 헤더에서 토큰 확인 => 서비스로 전달 => 쿠키와 유저 정보 받아오기
    getLoginInfo = async (req, res) => {
        console.log('UserController.getLoginInfo 함수 시작');

        try {
            const { authorization } = req.headers;
            const [authType, kakaoToken] = (authorization || '').split(' ');

            if (authType !== 'Bearer')
                throw new UserError('authorization 헤더 타입 인증 실패', 400);
            if (!kakaoToken) throw new UserError('카카오 토큰이 헤더에 없습니다.', 400);
            console.log('kakaoToken:::::: ', kakaoToken);
            ///
            const [loginInfo, statusCode] = await UserService.getLoginInfo(kakaoToken);
            return res.status(statusCode).send(loginInfo);
            ///
        } catch (e) {
            console.log(e);
            return res.status((e.statusCode ??= 500)).send({ errorMessage: e.message });
        }
    };

    // 유저 정보 조회
    getUserRecord = async (req, res) => {
        try {
            console.log('res.locals.user:: ', res.locals.user);
            const { user } = res.locals;

            const userInfo = await UserService.getUserRecord(user._id);
            console.log(userInfo);
            return res.status(200).send(userInfo);
        } catch (e) {
            console.log(e);
            return res.status((e.statusCode ??= 500)).send({ errorMessage: e.message });
        }
    };

    // 닉네임 변경
    updateNick = async (req, res) => {
        try {
            const { user } = res.locals;
            const { nickname } = req.body;
            if (!nickname) throw new UserError('변경할 닉네임을 입력해주세요', 400);
            if (nickname.match(/\s/g))
                throw new UserError('닉네임에 공백이 포함될 수 없습니다.', 400);
            await UserService.updateNick(user._id, nickname);
            return res.status(200).json({ nickname });
        } catch (e) {
            console.log(e);
            return res.status((e.statusCode ??= 500)).send({ errorMessage: e.message });
        }
    };
}

module.exports = new UserController();
