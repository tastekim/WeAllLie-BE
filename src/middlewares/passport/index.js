const passport = require('passport');
const kakao = require('./kakao-stratege');
const { User } = require('../../schemas/user');
const jwtService = require('../../users/jwt');

module.exports = () => {
  passport.serializeUser((accessToken, done) => {
    console.log('###### 여기는 /passport/index.js serializeUser');
    console.log('accessToken :::', accessToken);
    jwtService.validateAccessToken(accessToken).then((_id) => {
      console.log('여기는 serializeUser / then!! _id: ', _id);
      done(null, _id);
    });
  });

  passport.deserializeUser(async (_id, done) => {
    console.log('###### 여기는 /passport/index.js DDDDDeserializeUser');

    User.findOne({ _id })
      .then((user) => {
        accessToken = jwtService.createAccessToken(_id);
        user.accessToken = accessToken;
        console.log('여기는 then!! user: ', user);
        done(null, user);
      })
      .catch((err) => done(err));
  });
  kakao();
};
