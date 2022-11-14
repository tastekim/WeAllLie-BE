const { User } = require('../schemas/user');
const axios = require('axios');
const qs = require('qs');

class UtilFunction {
  kakaoToken = async () => {
    return await axios({
      method: 'POST',
      url: 'https://kauth.kakao.com/oauth/token',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: qs.stringify({
        grant_type: 'authorization_code',
        client_id: process.env.CLIENT_ID,
        redirectUri: process.env.CALLBACK_URL2,
        code: req.query.code,
      }),
    });
  };

  userInfo = async (kakaoToken) => {
    return await axios({
      method: 'get',
      url: 'https://kapi.kakao.com/v2/user/me',
      headers: {
        Authorization: `Bearer ${kakaoToken.data.access_token}`,
      },
    });
  };

  lastNum = async () => {
    const allUser = await User.find();
    return allUser.slice(-1)[0]['_id'];
  };

  autoIncrease = () => {
    let a = this.lastNum();
    const inner = function () {
      return a++;
    };
    return inner;
  };
}

module.exports = new UtilFunction();
