const passport = require('passport');
const kakao = require('./kakao-stratege');
const User = require('../../schemas/user');

module.exports = () => {
  passport.serializeUser((user, done) => {
    console.log('ㅇㅅㅇ');
    console.log('user :::', user);
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    console.log('디비에서 유저 찾아야 할 부분');
    console.log('profile :::', user._json.kakao_account.profile);
    // User.findOne(id)
    //   .then((user) => done(null, user.id))
    //   .catch((err) => done(err));
    done(null, user);
  });
  kakao();
};
