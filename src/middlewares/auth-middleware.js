const jwtService = require('../users/jwt');
const User = require('../schemas/user');
require('dotenv').config();
if (!process.env.SECRET_KEY) throw new Error('SECRET_KEY is required!!');

module.exports = async (req, res, next) => {
    console.log('req ::', req);
    const { authorization } = req.headers;
    const [authType, accessToken] = (authorization || '').split(' ');

    try {
        if (!accessToken || authType !== 'Bearer') throw new Error();
        const _id = await jwtService.validateAccessToken(accessToken);
        const userInfo = await User.findById(_id);
        res.locals.user = userInfo;
        next();
    } catch (error) {
        error.statusCode = 401;
        error.message = '토큰 인증 실패';
        next(error);
    }
};
