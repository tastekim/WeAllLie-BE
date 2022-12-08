const UserRepo = require('./user-repo');
const UserService = require('./user-service');
const jwtService = require('../users/util/jwt');
const UserFunction = require('../users/util/user-function');
const { UserError } = require('../middlewares/exception');
require('dotenv').config();

class UserProvider {
    getKakaoToken = async (req, res) => {
        console.log('-------------------------------------------');
        console.log('여기는 user-provider.js 의 getKakaoToken!!!!!');
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
    getKakaoUserInfo = async (req, res, next) => {
        console.log('-------------------------------------------');
        console.log('여기는 user-provider.js 의 getKakaoUserInfo!!!!!');

        try {
            const { authorization } = req.headers;
            const kakaoToken = (authorization || '').split(' ')[1];

            // 토큰 카카오에 보내고 유저정보 받아오기
            const kakaoUserInfo = await UserRepo.getKakaoUserInfo(kakaoToken);

            console.log('kakaoToken:::::: ', kakaoToken);
            console.log('kakaoUserInfo::::::', kakaoUserInfo);

            // 카카오에서서 받은 유저정보에서 이메일로 DB에 저장된 유저 확인, 존재한다면 유저정보 가져오기 (undefinded일 수도.)
            // 유저가 존재한다면 전달할 형태로 Refo에서 가공되어져서 받아옴!!
            const exUserInfo = await this.exUserGetToken(kakaoUserInfo);

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
            const newUserInfo = await this.createUserToken(kakaoUserInfo);
            console.log('user-provider.js, newUserInfo:::', newUserInfo);

            return res.status(201).json({
                nickname: newUserInfo.nickname,
                accessToken: newUserInfo.accessToken,
                spyWinRating: 0,
                voteSpyRating: 0,
            });
        } catch (e) {
            console.log(e);
            res.send({ errorMessage: e.message });
        }
    };

    // 유저 정보 조회
    getPlayRecord = async (req, res, next) => {
        try {
            console.log('res.locals.user:: ', res.locals.user);
            const { user } = res.locals;
            const exUser = await UserRepo.findOneById(user._id);
            const userInfo = await UserFunction.getPlayRecord(exUser);
            console.log('유저 정보 전적으로 가공 후 !! userInfo ::', userInfo);
            return res.status(200).json(userInfo);
        } catch (e) {
            console.log(e);
            res.send({ errorMessage: e.message });
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
    // DB에 유저 정보 없음 => DB 저장 / 토큰발급 / 토큰 + 유저 게임정보 리턴
    createUserToken = async (kakaoUserInfo) => {
        console.log('-------------------------------------------');
        console.log('여기는 user-provider.js 의 createUserToken!!!!!');

        const allUser = await UserRepo.findAllUser();
        const newUser = await UserRepo.createNewUser(kakaoUserInfo, allUser);

        console.log('여기는 user-provider.js 3, newUser::::::', newUser);

        // 새로 생셩한 newUser에게 _id 값으로 토큰 발급
        const newUserToken = await jwtService.createAccessToken(newUser._id);

        // 클라이언트에 전달하기 위해 유저 정보 가공
        const playRecord = await UserFunction.getPlayRecord(newUser);
        playRecord.accessToken = newUserToken;
        return playRecord;
    };

    exUserGetToken = async (kakaoUserInfo) => {
        // 존재하는 유저일 경우 토큰 발급하여 가져오기
        console.log('-------------------------------------------');
        console.log('여기는 user-provider.js 의 exUserGetToken!!!!!');

        const exUser = await UserRepo.findOneByEmail(kakaoUserInfo.kakao_account.email);
        console.log('exUserGetToken 1, exUser:::::: ', exUser);

        if (exUser) {
            const accessToken = await jwtService.createAccessToken(exUser._id);
            console.log('exUserGetToken 2, accessToken::::::', accessToken);

            const playRecord = await UserFunction.getPlayRecord(exUser);
            playRecord.accessToken = accessToken;
            console.log('exUserGetToken 3, playRecord::::::', playRecord);
            return playRecord;
        } else return;
    };
}

module.exports = new UserProvider();
