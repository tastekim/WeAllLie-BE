const passport = require('passport');
const kakao = require('./kakao-stratege');
const { User } = require('../../schemas/user');
const jwtService = require('../../users/jwt');

module.exports = () => {
  passport.serializeUser((accessToken, done) => {
    console.log('/passport/index.js serializeUser');
    console.log('user :::', accessToken);
    done(null, accessToken);
  });

  passport.deserializeUser(async (accessToken, done) => {
    console.log('/passport/index.js DDDDDeserializeUser');
    console.log(accessToken);
    const { email } = jwtService
      .validateAccessToken(accessToken)
      .then((email) => {
        console.log(email);
        return email;
      });
    User.findOne({ email })
      .then((user) => {
        console.log('여기는 then!! user: ', user);
        done(null, user);
      })
      .catch((err) => done(err));
  });
  kakao();
};
