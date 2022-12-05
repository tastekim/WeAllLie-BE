const UserService = require('./user-service');
const { CustomError } = require('./util/user-exception');

require('dotenv').config();

class UserController {
    getKakaoToken = async (req, res) => {
        const { code } = req.query;
        console.log('전달받은 인가 코드 ::: ', code);
        if (!code) throw new CustomError('인가코드가 존재하지 않습니다.', 400);

        const kakaoToken = await UserService.getKakaoToken(code);

        // 헤더 설정 : 필요한 부분인지 테스트 필요
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Content-Type', 'text/html; charset=utf-8');

        return res.send({ accessToken: kakaoToken });
    };

    /*
    1. 클라이언트에서 토큰 전달 받아서 카카오에 유저정보 요청
    2. DB의 유저정보와 비교하여 필요시 회원가입
    3. 유저정보 가공하여 클라이언트로 전달 => 쿠키로 토큰 전달 / 바디로 닉네임만 전달
    */
    getKakaoUserInfo = async (req, res, next) => {
        console.log('여기는 user-controller.js 의 getKakaoUserInfo');
        try {
            const { authorization } = req.headers;
            const [authType, kakaoToken] = (authorization || '').split(' ');

            if (!kakaoToken) throw new CustomError('헤더에 토큰이 존재하지 않습니다.', 400);
            if (!authType || authType !== 'Bearer')
                throw new CustomError('authorization 헤더 타입 오류', 400);

            console.log('kakaoToken:::::: ', kakaoToken);

            // 토큰 카카오에 보내고 유저정보 확인하여 회원가입/로그인 후 서버에서 발급한 accessToken 받아오기
            const { nickname, accessToken } = await UserService.getAccessToken(kakaoToken);

            /*
            // 프론트로 쿠키 전달되지 않아 쿠키 세팅 보류
            res.cookie('accessToken', accessToken, {
                expires: new Date(Date.now() + 1000 * 60 * 60),
                secure: true,
                httpOnly: true,
            });
            */

            return res.status(200).json({ nickname, accessToken });
        } catch (e) {
            next(e);
        }
    };
}

module.exports = new UserController();
