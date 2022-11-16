const jwt = require('jsonwebtoken');
require('dotenv').config();

class jwtService {
    // Access Token 생성
    createAccessToken = async (_id) => {
        return jwt.sign({ _id: _id }, process.env.SECRET_KEY, {
            expiresIn: '3h',
        });
    };
    // Refresh Token 생성
    createRefreshToken = async () => {
        return jwt.sign({}, process.env.SECRET_KEY, { expiresIn: '7d' });
    };

    getAccessTokenPayload = async (accessToken) => {
        try {
            const payload = jwt.verify(accessToken, process.env.SECRET_KEY);
            return payload;
        } catch (error) {
            return null;
        }
    };

    // Access Token 검증
    validateAccessToken = async (accessToken) => {
        try {
            const { _id } = jwt.verify(accessToken, process.env.SECRET_KEY);
            return _id;
        } catch (error) {
            return null;
        }
    };

    // Refresh Token 검증
    validateRefreshToken = async (refreshToken) => {
        try {
            jwt.verify(refreshToken, process.env.SECRET_KEY);
            return true;
        } catch (error) {
            return false;
        }
    };
}

module.exports = new jwtService();
