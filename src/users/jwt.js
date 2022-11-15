const jwt = require('jsonwebtoken');
require('dotenv').config();

class jwtService {
  // Access Token 생성
  createAccessToken = async (_id) => {
    return jwt.sign(
      {
        _id: _id,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: '3h',
      }
    );
  };
  // Refresh Token 생성
  createRefreshToken = async () => {
    return jwt.sign({}, process.env.SECRET_KEY, { expiresIn: '7d' });
  };

  // Access Token 검증
  validateAccessToken = async (accessToken) => {
    try {
      const { _id } = jwt.verify(accessToken, process.env.SECRET_KEY);
      return _id;
    } catch (error) {
      return { errorMessage: 'AccessToken이 유효하지 않습니다.' };
    }
  };

  // Refresh Token 검증
  validateRefreshToken = async (refreshToken) => {
    try {
      return jwt.verify(refreshToken, process.env.SECRET_KEY);
    } catch (error) {
      return { errorMessage: 'RefreshToken 유효하지 않습니다.' };
    }
  };
}

module.exports = new jwtService();
