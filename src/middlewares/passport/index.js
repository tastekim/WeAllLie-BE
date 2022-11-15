const passport = require('passport');
const kakao = require('./kakao-stratege');
const { User } = require('../../schemas/user');
const jwtService = require('../../users/jwt');
require('dotenv').config();

module.exports = () => {
  passport.serializeUser((accessToken, done) => {
    console.log('###### 여기는 /passport/index.js serializeUser');
    console.log('accessToken :::', accessToken);
    done(null, accessToken);
    // jwtService.validateAccessToken(accessToken).then((_id) => {
    //   console.log('여기는 serializeUser / then!! _id: ', _id);
    //   done(null, _id);
    // });
  });

  passport.deserializeUser(async (accessToken, done) => {
    console.log('###### 여기는 /passport/index.js DDDDDeserializeUser');
    console.log(accessToken);
    const _id = await jwtService.validateAccessToken(accessToken);
    const exUser = await User.findOne({ _id });
    let userInfo;
    console.log(userInfo);

    let spyWinRating, voteSpyRating, totalCount;
    if (exUser.totalCount === 0) {
      spyWinRating = 0;
      voteSpyRating = 0;
    } else if (exUser.spyPlayCount === 0) {
      spyWinRating = 0;
    } else if (exUser.totalCount - exUser.spyPlayCount === 0) {
      voteSpyRating = 0;
    }

    spyWinRating = (exUser.spyWinCount / exUser.spyPlayCount).toFixed(2) * 100;
    voteSpyRating =
      (exUser.voteSpyCount / (exUser.totalCount - exUser.spyPlayCount)).toFixed(
        2
      ) * 100;

    console.log('spyWinRating', spyWinRating);
    console.log('voteSpyRating', voteSpyRating);

    userInfo = {
      accessToken,
      userId: exUser._id,
      nickname: exUser.nickname,
      profileImg: exUser.profileImg,
      totayPlayCount: exUser.totalCount,
      spyPlayCount: exUser.spyPlayCount,
      ctzPlayCount: exUser.totalCount - exUser.spyPlayCount,
      spyWinRating,
      voteSpyRating,
    };
    done(null, userInfo);

    // await User.findOne({ _id })
    //   .then((user) => {
    //     accessToken = jwtService.createAccessToken(_id);
    //     console.log('accessToken::::::', accessToken);
    //     user.accessToken = accessToken;
    //     console.log('여기는 then!! user: ', user);
    //     user.accessToken = accesstoken;

    //     done(null, user);
    //   })
    // .catch((err) => done(err));
  });

  kakao();
};
