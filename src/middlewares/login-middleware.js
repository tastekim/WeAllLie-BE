const UserRepo = require('../users/user-repo');
const jwtService = require('../users/jwt');
require('dotenv').config();

module.exports = async (req, res, next) => {
    try {
        console.log('------------------------------------');
        console.log('여기는 login-middleware.js');
        // 직접 발급한 토큰이 없다면 다음으로 넘기기 (직접 토큰 발급 받을 수 있도록)
        const { authorization } = req.headers;
        const accessToken = (authorization || '').split(' ')[1];
        console.log('로그인 미들웨어 accessToken 확인 ::::::', accessToken);
        if (!accessToken) {
            next();
        } else {
            // authToken(카카오에서 받은 토큰)을 헤더의 authorization으로 넘겨주고 있으므로,
            // 직접 발급한 토큰은 accessToken 으로 구분하기
            const _id = await jwtService.validateAccessToken(accessToken);
            const user = await UserRepo.findOneById(_id);
            console.log('user::::::', user);
            const userPlayRecord = await UserRepo.getPlayRecord(user, accessToken);
            res.status(200).json(userPlayRecord);
        }
    } catch (error) {
        next(error);
    }
};
