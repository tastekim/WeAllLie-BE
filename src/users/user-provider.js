const UserRepo = require('./user-repo');
const jwtService = require('../users/util/jwt');
// const redis = require('../redis');
require('dotenv').config();

class UserProvider {
    kakaoCallback = async (req, res) => {
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
        console.log('userInfo:::>', userInfo);
        res.header('Access-Control-Allow-Origin', '*');
        res.status(200).redirect('/user/kakao');
    };

    getKakaoToken = async (req, res) => {
        console.log('-------------------------------------------');
        console.log('여기는 user-provider.js 의 getKakaoToken!!!!!');
        console.log('전달받은 인가 코드 :::::::::::: ', req.query.code);

        const kakaoToken = await UserRepo.getKakaoToken(req.query.code);

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
                res.cookie('accessToken', exUserInfo.accessToken, {
                    expires: new Date(Date.now() + 1000 * 60 * 60),
                    secure: true,
                    httpOnly: true,
                    SameSite: 'None',
                });

                return res.status(200).json({
                    accessToken: exUserInfo.accessToken,
                    nickname: exUserInfo.nickname,
                    spyWinRating: exUserInfo.spyWinRating,
                    voteSpyRating: exUserInfo.voteSpyRating,
                });
            }
            // 2. 미가입 유저 => 회원가입 + 토큰발급 후 토큰 + 유저정보 전달
            const newUserInfo = await this.createUserToken(kakaoUserInfo);
            console.log('user-provider.js, newUserInfo::::::', newUserInfo);
            console.log('-------------------쿠키설정-------------------------');
            /*
            // 프론트로 쿠키 전달되지 않아 쿠키 세팅 보류
            await redis.set(refreshToken, payload.userId, { EX: 3600*24, NX: true });
            res.cookie('accessToken', exUserInfo.accessToken, {
                expires: new Date(Date.now() + 1000 * 60 * 60),
                secure: true,
                httpOnly: true,
                SameSite: 'None',
            });
            */
            return res.status(201).json({
                nickname: newUserInfo.nickname,
                accessToken: newUserInfo.accessToken,
                spyWinRating: 0,
                voteSpyRating: 0,
            });
        } catch (e) {
            next(e);
        }
    };

    // 유저 정보 조회
    onlyGetPlayRecord = async (req, res) => {
        try {
            const { nickname } = req.params;
            if (!nickname) throw new Error('nickname을 입력해야 합니다.');
            const exUser = await UserRepo.findOneByNickname(nickname);
            if (!exUser) throw new Error('nickname과 일치하는 유저가 존재하지 않습니다.');

            const userInfo = await UserRepo.onlyGetPlayRecord(exUser);
            if (!userInfo.nickname === res.locals.user.nickname)
                throw new Error('nickname과 토큰 정보가 일치하지 않습니다.');
            console.log('res.locals.user:: ', res.locals.user);
            return res.status(200).json(userInfo);
        } catch (e) {
            console.log(e);
            return res.status(400).json({ error: e.message });
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
        const playRecord = await UserRepo.getPlayRecord(newUser, newUserToken);

        return playRecord;
    };

    getUserInfo = async (decodedId, accessToken) => {
        const exUser = await UserRepo.findOneById(decodedId);
        console.log('-------------------------------------------');
        console.log('여기는 user-provider.js 의 getUserInfo!!!!!');
        console.log('exUser::::::', exUser);

        const playRecord = await UserRepo.getPlayRecord(exUser, accessToken);
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

            const playRecord = await UserRepo.getPlayRecord(exUser, accessToken);
            console.log('exUserGetToken 3, playRecord::::::', playRecord);
            return playRecord;
        } else return;
    };
}

module.exports = new UserProvider();
