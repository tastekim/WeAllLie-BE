const { UserError } = require('../middlewares/exception');
const jwtService = require('../users/util/jwt');
const User = require('../schemas/user');
require('dotenv').config();

module.exports = async (req, res, next) => {
    console.log('req.headers ::', req.headers);
    const { authorization } = req.headers;
    const [authType, accessToken] = (authorization || '').split(' ');

    try {
        if (!accessToken) throw new UserError('헤더에 토큰이 존재하지 않습니다.', 401);
        if (!authType || authType !== 'Bearer')
            throw new UserError('authorization 헤더 타입이 올바르지 않습니다.', 401);

        const _id = await jwtService.validateAccessToken(accessToken);
        if (!_id) throw new UserError('accessToken 만료, 다시 로그인해주세요.', 401);
        const userInfo = await User.findById(_id);
        res.locals.user = userInfo;
        next();
    } catch (error) {
        next(error);
    }
};
