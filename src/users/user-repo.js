const User = require('../schemas/user');
require('dotenv').config();

class UserRefo {
    //
    findAllUser = async () => {
        const allUser = await User.find({});
        return allUser;
    };

    findOneByEmail = async (email) => {
        const exUser = await User.findOne({ email });
        return exUser;
    };

    findOneByNickname = async (nickname) => {
        const exUser = await User.findOne({ nickname });
        return exUser;
    };

    findOneById = async (id) => {
        const exUser = await User.findById(id);
        return exUser;
    };

    updateNick = async (_id, nickname) => {
        await User.updateOne({ _id }, { nickname });
    };

    createNewUser = async (kakaoUserInfo, allUser) => {
        const allUserCount = allUser.length;
        let nickNum, nickname, _id;

        // DB에 유저가 하나도 없다면 초기값 세팅
        if (allUserCount === 0) {
            _id = 1;
            nickname = 'Agent_001';
        } else {
            // DB에 유저가 있을 경우
            const n = +allUser[allUserCount - 1]._id + 1;
            // n이 1000이상이면 Agent_ 뒤에 그대로 붙이고, 1000보다 작으면 001 의 형태로 붙이기
            if (n < 1000) {
                nickNum = (0.001 * n).toFixed(3).toString().slice(2);
                nickname = `Agent_${nickNum}`;
            } else {
                nickname = `Agent_${n}`;
            }
            _id = +nickNum;
        }
        // 위에서 만든 값으로 newUser DB 에 저장하기
        const newUser = await User.create({
            _id,
            nickname,
            email: kakaoUserInfo.kakao_account.email,
            profileImg: kakaoUserInfo.properties.thumbnail_image
                ? kakaoUserInfo.properties.thumbnail_image
                : 'default',
        });
        return newUser;
    };
}

module.exports = new UserRefo();
