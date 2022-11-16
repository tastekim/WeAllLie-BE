const passport = require('passport');
const kakao = require('./kakao-stratege');
const { User } = require('../../schemas/user');
const jwtService = require('../../users/jwt');
require('dotenv').config();

module.exports = () => {
    passport.serializeUser((user, done) => {
        console.log('/passport/index.js serializeUser');
        console.log('user :::', user.nickname);
        done(null, user.nickname);
    });

    passport.deserializeUser((nickname, done) => {
        console.log('/passport/index.js DDDDDeserializeUser');
        console.log(nickname);
        User.findOne({ nickname })
            .then((user) => {
                console.log('여기는 then!! user: ', user);
                done(null, user);
            })
            .catch((err) => done(err));
    });
    kakao();
};
