const { User } = require('../schemas/user');
const jwtService = require('./jwt');

class UserProvider {
  exUserGetToken = async (user) => {
    const exUser = await User.findOne({
      email: user.kakao_account.email,
    });

    if (exUser) {
      const accessToken = await jwtService.createAccessToken(exUser._id);
      return accessToken;
    } else return;
  };

  createUserToken = async (user) => {
    // DB에 유저 정보 없음 => 회원가입 / 토큰발급 / 토큰리턴
    let nickNum, nickname, _id;
    let allUser = await User.find();

    if (allUser.length === 0) {
      _id = 1;
      nickname = 'Agent_001';
    } else {
      let lastNum = allUser.slice(-1)[0].nickname;
      let n = +lastNum.slice(6) + 1;

      if (n < 1000) {
        nickNum = (0.001 * n).toFixed(3).toString().slice(2);
        nickname = `Agent_${nickNum}`;
      } else {
        nickname = `Agent_${n}`;
      }

      _id: +nickNum + 1;
      nickname: nickname;
    }
    const newUser = await User.create({
      _id,
      nickname,
      email: user.kakao_account.email,
      profileImg: user.properties.thumbnail_image
        ? user.properties.thumbnail_image
        : 'default',
    });

    const newUserToken = await jwtService.createAccessToken(newUser.email);
    return newUserToken;
  };
}

module.exports = new UserProvider();
