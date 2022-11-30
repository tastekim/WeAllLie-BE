const jwtService = require('../users/jwt');
const { User } = require('../schemas/user');
require('dotenv').config();
if (!process.env.SECRET_KEY) throw new Error('SECRET_KEY is required!!');

module.exports = async (req, res, next) => {
    const { authorization } = req.headers;
    const [authType, authToken] = (authorization || '').split(' ');

    try {
        if (!authToken || authType !== 'Bearer') throw new Error();
        const _id = await jwtService.validateAccessToken(authToken);
        User.findOne({ _id }).then((user) => {
            // DB에 저장된 user 정보 =>  res.locals.user 에 담겨 있으니 이용하시면 됩니다!
            res.locals.user = user;
            next();
        });
    } catch (error) {
        error.statusCode = 401;
        error.message = '토큰 인증 실패';
        next(error);
    }
};
