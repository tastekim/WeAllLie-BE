const { User } = require('../schemas/user');
const jwtService = require('../users/jwt');
require('dotenv').config();

module.exports = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        const [authType, authToken] = (authorization || '').split(' ');
        if (!authToken || authType !== 'Bearer') {
            // 토큰이 잘못된 방식으로 전달된 경우...이지만 어쨌든 카카오 인증 성공한 상태이므로 재발급!
            // 에러만 나지 않도록 따로 처리
            const { email } = await jwtService.validateAccessToken(authToken);
            const user = await User.findOne({ email });
            user.accesToken = authToken;
            res.locals.user = user;
            next();
        }

        const { email } = await jwtService.validateAccessToken(authToken);

        const user = await User.findOne({ email });
        // 유효한 토큰일 경우 미리 유저 정보에 넣어서 다음 미들웨어에서 사용할 수 있도록 함
        user.accesToken = authToken;
        // DB에 저장된 user 정보 =>  res.locals.user 에 담겨 있으니 이용하시면 됩니다!
        res.locals.user = user;
        next();
    } catch (error) {
        // 토큰은 확인되는데 유효성 검증에 실패한 경우 (재발급)
        next();
    }
};
