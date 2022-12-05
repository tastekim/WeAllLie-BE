class UserFunction {
    // DB에 저장할 형태로 유저 정보 가공
    getNewUser = async (kakaoUserInfo, allUser) => {
        const allUserCount = allUser.length;
        let nickNum, nickname, _id;

        // 유저가 한 명도 없을 경우 초기값 세팅
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

        // 위에서 만든 값으로 DB에 저장할 유저 정보 가공해서 리턴
        const newUser = {
            _id,
            nickname,
            email: kakaoUserInfo.kakao_account.email,
            profileImg: kakaoUserInfo.properties.thumbnail_image
                ? kakaoUserInfo.properties.thumbnail_image
                : 'default',
        };
        return newUser;
    };

    // user: DB에서 가져온 유저 정보
    getPlayRecord = async (user) => {
        let spyWinRating, voteSpyRating;

        spyWinRating = (user.spyWinCount / user.spyPlayCount).toFixed(2) * 100;
        voteSpyRating =
            (user.voteSpyCount / (user.totalCount - user.spyPlayCount)).toFixed(2) * 100;

        if (user.totalCount === 0) {
            return {
                userId: user._id,
                nickname: user.nickname,
                profileImg: user.profileImg,
                totayPlayCount: user.totalCount,
                spyPlayCount: user.spyPlayCount,
                ctzPlayCount: user.totalCount - user.spyPlayCount,
                spyWinRating: 0,
                voteSpyRating: 0,
            };
        } else if (user.spyPlayCount === 0 && user.totalCount - user.spyPlayCount !== 0) {
            return {
                userId: user._id,
                nickname: user.nickname,
                profileImg: user.profileImg,
                totayPlayCount: user.totalCount,
                spyPlayCount: user.spyPlayCount,
                ctzPlayCount: user.totalCount - user.spyPlayCount,
                spyWinRating: 0,
                voteSpyRating,
            };
        } else if (user.spyPlayCount !== 0 && user.totalCount - user.spyPlayCount === 0) {
            return {
                userId: user._id,
                nickname: user.nickname,
                profileImg: user.profileImg,
                totayPlayCount: user.totalCount,
                spyPlayCount: user.spyPlayCount,
                ctzPlayCount: user.totalCount - user.spyPlayCount,
                spyWinRating,
                voteSpyRating: 0,
            };
        }

        spyWinRating = (user.spyWinCount / user.spyPlayCount).toFixed(2) * 100;
        voteSpyRating =
            (user.voteSpyCount / (user.totalCount - user.spyPlayCount)).toFixed(2) * 100;

        return {
            userId: user._id,
            nickname: user.nickname,
            profileImg: user.profileImg,
            totayPlayCount: user.totalCount,
            spyPlayCount: user.spyPlayCount,
            ctzPlayCount: user.totalCount - user.spyPlayCount,
            spyWinRating,
            voteSpyRating,
        };
    };
}

module.exports = new UserFunction();