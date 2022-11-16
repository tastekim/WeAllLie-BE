const jwt = require('jsonwebtoken');
const { User } = require('../schemas/user');
require('dotenv').config();
if (!process.env.SECRET_KEY) throw new Error('SECRET_KEY is required!!');

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    const [authType, authToken] = (authorization || '').split(' ');
    if (!authToken || authType !== 'Bearer') {
        return res.status(401).send({
            errorMessage: '로그인 후 이용 가능한 기능입니다.',
        });
    }

    try {
        const { _id } = jwt.verify(authToken, process.env.SECRET_KEY);
        User.findOne({ _id }).then((user) => {
            // DB에 저장된 user 정보 =>  res.locals.user 에 담겨 있으니 이용하시면 됩니다!
            res.locals.user = user;
            next();
        });
    } catch (err) {
        res.status(401).send({
            errorMessage: '로그인 후 이용 가능한 기능입니다.',
        });
    }
};
