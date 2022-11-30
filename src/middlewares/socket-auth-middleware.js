const jwtService = require('../users/jwt');
require('dotenv').config();

if (!process.env.SECRET_KEY) throw new Error('SECRET_KEY is required!!');

/*
소켓 인증 미들웨어
1. 1차: 토큰 존재 여부 확인
2. 2차: 토큰의 유효성 검증하여 닉네임 확인 후 리턴
*/

module.exports = async (socket, next) => {
    console.log('----------------쿼리로 넘어온 값-------------------');
    const { query } = socket.handshake;
    const userInfo = await jwtService.validateSocketToken(query);
    if (!userInfo) {
        // 소켓에서 어떻게 에러 처리?
        next(new Error('토큰 인증 실패'));
    } else {
        // 유저 정보 존재 시 socket.userInfo 에 유저 정보 담아 둠
        socket.userInfo = userInfo;
        next();
    }
    console.log('chat.use 에서 확인한 유저 정보 :: ', userInfo);
    next();
};
